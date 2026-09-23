/**
 * Framework-agnostic three.js particle sphere.
 *
 * Owns the renderer, scene, camera, points and the RAF loop, along with the
 * cursor attractor and the morph state machine. Kept free of React so the
 * rendering logic is easy to reason about; the React component
 * (`particle-sphere.tsx`) is a thin lifecycle wrapper around this class.
 */

import * as THREE from 'three';
import {
  fibonacciSphere,
  mulberry32,
  lerp,
  morphValue,
  accentMask,
  dampToward,
  radialNormals,
} from './math';
import { cappedDelta } from './perf';
import { particleVertexShader, particleFragmentShader } from './shaders';
import type { MorphTarget } from './targets';

export interface ParticleSystemOptions {
  count?: number;
  /** Particle color as a hex string, e.g. '#1a1a1a'. */
  color?: string;
  /** When true, render a single static frame and never start the RAF loop. */
  reducedMotion?: boolean;
  /** Sphere radius in world units. */
  radius?: number;
  /** Global point size multiplier. */
  size?: number;
  /** Y-axis rotation per frame (radians) at 60fps. */
  rotationSpeed?: number;
  /** Seed for deterministic per-particle variation. */
  seed?: number;
}

const DEFAULTS = {
  count: 40000,
  color: '#1a1a1a',
  reducedMotion: false,
  radius: 1,
  size: 4.4,
  rotationSpeed: 0.0009,
  seed: 1337,
};

const BREATH_PERIOD = 3.5; // seconds
const BREATH_AMPLITUDE = 0.0125; // 1.0 .. 1.025

const FOV = 50;
const CAMERA_Z = 3.2;
const MAX_PIXEL_RATIO = 2;
const CURSOR_RADIUS_PX = 120; // influence radius in screen pixels
const CURSOR_STRENGTH = 0.55; // peak pull fraction toward cursor
const CURSOR_DAMPING = 0.12; // smoothing per frame

const MORPH_STAGGER = 0.4; // per-particle delay spread; must match shader
const MORPH_DURATION = 1.6; // seconds, form → form
const MORPH_BULGE = 0.18; // mid-transition noise displacement amplitude
const MORPH_NOISE_SCALE = 1.5;

// Sphere randomness — breaks the perfect shell (Spline-style scatter).
const SURFACE_JITTER = 0//0.045; // radial + tangential roughness
const STRAY_RATIO = 0//0.08; // fraction of particles that drift off the shell
const STRAY_DISTANCE = 0//0.05; // how far strays can float outward
// Tangential scatter that breaks the Fibonacci lattice. At full-viewport scale
// its regular spacing otherwise beats against the soft grain as moiré rings.
// Points are re-projected onto the shell, so the sphere stays clean.
const LATTICE_JITTER = 0.014;

// Surface lighting. The key light sits upper-left, slightly toward the camera,
// and stays fixed in world space so shading holds steady while the shape spins.
const LIGHT_DIR = new THREE.Vector3(-0.55, 0.65, 0.55).normalize();
const SHADE_STRENGTH = 1;

const CHROMATIC_RATIO = 0.05; // ~5% of particles get the cyan accent
const ACCENT_COLOR = '#b0d4d4'; // faint desaturated cyan

// Spin: drag-to-rotate with inertia decaying into a gentle idle auto-rotate.
const IDLE_SPIN = 0.12; // idle Y angular velocity (rad/s)
const DRAG_SENSITIVITY = 0.006; // radians of rotation per pixel dragged
const SPIN_DECAY = 1.8; // how fast release-inertia settles to idle (lambda)
const SPIN_MAX = 3.0; // clamp angular velocity (rad/s)
const BALL_THRESHOLD = 0.15; // attraction fades in over the last 15% of a morph to the sphere

export class ParticleSystem {
  supported: boolean = false;

  private opts: Required<ParticleSystemOptions>;
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private points: THREE.Points | null = null;
  private geometry: THREE.BufferGeometry | null = null;
  private material: THREE.ShaderMaterial | null = null;

  private rafId: number | null = null;
  private clock = new THREE.Clock();
  private running = false;
  private clockStarted = false;
  /** Own elapsed accumulator (delta-capped) — frame-rate independent. */
  private elapsed = 0;
  /** Smoothed-to color target for theme transitions. */
  private colorTarget = new THREE.Color();
  /** Ink mode target: 1 when the grain is darker than mid-grey (light theme). */
  private inkTarget = 0;

  // Cursor attractor state (world space). Smoothed toward targets each frame.
  private cursorTarget = new THREE.Vector3();
  private cursorStrengthTarget = 0;
  private viewportHeight = 1;

  // Spin state: angular velocity (rad/s) with drag + inertia + idle decay.
  private spinVelX = 0;
  private spinVelY = IDLE_SPIN;
  private idleSpin = IDLE_SPIN; // target idle drift (tunable per section)
  private dragging = false;
  private lastSpinTime = 0;

  // Morph state. The geometry always holds a "from" form (position/normal)
  // and a "to" form (aPositionTarget/aNormalTarget); uProgress runs 0 → 1.
  // Switching mid-morph bakes the in-flight state into "from", so forms flow
  // directly into one another instead of routing through the sphere.
  private sphere: MorphTarget | null = null;
  private currentTarget: MorphTarget | null = null;
  private delays: Float32Array | null = null;
  private progressFrom = 1;
  private progressTo = 1;
  private morphDuration = MORPH_DURATION;
  private morphStartTime = 0;
  private morphing = false;

  constructor(
    private canvas: HTMLCanvasElement,
    options: ParticleSystemOptions = {},
  ) {
    this.opts = { ...DEFAULTS, ...options };

    // Attempt to create the renderer directly rather than probing with
    // getContext() first — probing consumes the context slot and then three.js
    // cannot acquire the same canvas again (Context Lost).
    // If three.js itself throws (no WebGL support), supported stays false.
    try {
      this.init();
      this.supported = true;
    } catch {
      this.dispose();
    }
  }

  private init() {
    const { radius, count, seed } = this.opts;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x000000, 0); // transparent; page bg shows through

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
    this.camera.position.set(0, 0, CAMERA_Z);

    // Base sphere positions.
    const positions = fibonacciSphere(count, radius);

    // Break the perfect shell: per-particle radial roughness + a small fraction
    // of "strays" that drift off the surface, plus subtle tangential jitter.
    // This gives the organic, scattered Spline look instead of a clean shell.
    const jrng = mulberry32(seed + 7);
    for (let i = 0; i < count; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];
      const len = Math.hypot(x, y, z) || 1;
      const nx = x / len;
      const ny = y / len;
      const nz = z / len;
      let r = radius + (jrng() - 0.5) * 2 * SURFACE_JITTER;
      if (jrng() < STRAY_RATIO) r += jrng() * STRAY_DISTANCE;
      const t = SURFACE_JITTER * 0.6;
      let px = nx * r + (jrng() - 0.5) * t;
      let py = ny * r + (jrng() - 0.5) * t;
      let pz = nz * r + (jrng() - 0.5) * t;
      // Lattice jitter, then back onto this particle's shell radius.
      px += (jrng() - 0.5) * 2 * LATTICE_JITTER;
      py += (jrng() - 0.5) * 2 * LATTICE_JITTER;
      pz += (jrng() - 0.5) * 2 * LATTICE_JITTER;
      const k = r / (Math.hypot(px, py, pz) || 1);
      positions[i * 3] = px * k;
      positions[i * 3 + 1] = py * k;
      positions[i * 3 + 2] = pz * k;
    }

    // Per-particle etching variation (deterministic).
    const rng = mulberry32(seed);
    const scales = new Float32Array(count);
    const opacities = new Float32Array(count);
    const delays = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // size 0.6..1.6, opacity 0.25..0.6 — finer and lighter than a sparse
      // cloud would need, since ~3x the grain overlaps into tone.
      scales[i] = 0.6 + rng() * 1.0;
      opacities[i] = 0.25 + rng() * 0.35;
      delays[i] = rng() * MORPH_STAGGER; // 0..0.4 stagger
    }

    // Start settled on the sphere: from = to = sphere, progress = 1.
    const target = positions.slice();
    const normals = radialNormals(positions);
    this.sphere = { positions: positions.slice(), normals: normals.slice() };
    this.currentTarget = this.sphere;
    this.delays = delays;

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    this.geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    this.geometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));
    this.geometry.setAttribute(
      'aPositionTarget',
      new THREE.BufferAttribute(target, 3),
    );
    this.geometry.setAttribute(
      'aNormalTarget',
      new THREE.BufferAttribute(normals.slice(), 3),
    );
    this.geometry.setAttribute('aDelay', new THREE.BufferAttribute(delays, 1));
    this.geometry.setAttribute(
      'aTint',
      new THREE.BufferAttribute(accentMask(count, CHROMATIC_RATIO, seed + 99), 1),
    );

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: 1 },
        uSize: { value: this.opts.size },
        uBreath: { value: 1 },
        uColor: { value: new THREE.Color(this.opts.color) },
        uAccentColor: { value: new THREE.Color(ACCENT_COLOR) },
        uCursor: { value: new THREE.Vector3() },
        uCursorRadius: { value: 0.5 },
        uCursorStrength: { value: 0 },
        uProgress: { value: 1 },
        uBulge: { value: MORPH_BULGE },
        uNoiseScale: { value: MORPH_NOISE_SCALE },
        uCameraDistance: { value: CAMERA_Z },
        uLightDir: { value: LIGHT_DIR.clone() },
        uShade: { value: SHADE_STRENGTH },
        uInk: { value: 0 },
      },
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);
    this.colorTarget.set(this.opts.color);
    this.inkTarget = inkFor(this.colorTarget);
    this.material.uniforms.uInk.value = this.inkTarget;
  }

  /** Half the world-space height visible at the z=0 plane. */
  worldHalfHeight(): number {
    return Math.tan(((FOV / 2) * Math.PI) / 180) * CAMERA_Z;
  }

  /** Resize the renderer/camera to the given CSS pixel dimensions. */
  setSize(width: number, height: number, pixelRatio = 1) {
    if (!this.renderer || !this.camera || !this.material) return;
    const dpr = Math.min(pixelRatio, MAX_PIXEL_RATIO);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / Math.max(height, 1);
    this.camera.updateProjectionMatrix();
    this.material.uniforms.uPixelRatio.value = dpr;

    // Convert the pixel-based cursor radius into world units.
    this.viewportHeight = Math.max(height, 1);
    const worldPerPixel = (2 * this.worldHalfHeight()) / this.viewportHeight;
    this.material.uniforms.uCursorRadius.value = CURSOR_RADIUS_PX * worldPerPixel;

    if (this.opts.reducedMotion) this.renderOnce();
  }

  /**
   * Feed a cursor position in NDC (-1..1, y up). `active=false` releases the
   * attractor (strength eases back to 0). No-op under reduced motion.
   */
  setCursor(ndcX: number, ndcY: number, active: boolean) {
    if (!this.camera || this.opts.reducedMotion) return;
    const halfH = this.worldHalfHeight();
    const halfW = halfH * this.camera.aspect;
    this.cursorTarget.set(ndcX * halfW, ndcY * halfH, 0);
    this.cursorStrengthTarget = active ? CURSOR_STRENGTH : 0;
  }

  /** Begin a drag-to-spin gesture. */
  spinStart() {
    if (this.opts.reducedMotion) return;
    this.dragging = true;
    this.spinVelX = 0;
    this.spinVelY = 0;
    this.lastSpinTime = (typeof performance !== 'undefined' ? performance.now() : 0);
  }

  /** Apply a drag delta (px) to the rotation and track velocity for inertia. */
  spinBy(dx: number, dy: number) {
    if (!this.dragging || !this.points || this.opts.reducedMotion) return;
    const ry = dx * DRAG_SENSITIVITY; // horizontal drag → spin around Y
    const rx = dy * DRAG_SENSITIVITY; // vertical drag → spin around X
    this.points.rotation.y += ry;
    this.points.rotation.x += rx;
    const now = typeof performance !== 'undefined' ? performance.now() : 0;
    const dt = Math.max((now - this.lastSpinTime) / 1000, 1 / 120);
    this.spinVelY = THREE.MathUtils.clamp(ry / dt, -SPIN_MAX, SPIN_MAX);
    this.spinVelX = THREE.MathUtils.clamp(rx / dt, -SPIN_MAX, SPIN_MAX);
    this.lastSpinTime = now;
  }

  /** End the drag; current velocity carries over as inertia. */
  spinEnd() {
    this.dragging = false;
  }

  /**
   * Kick a one-shot spin (rad/s around Y) that decays back to the idle drift.
   * Used for section entrances (e.g. the computer spinning in on Projects).
   */
  spinImpulse(velY = 10) {
    if (this.opts.reducedMotion) return;
    this.dragging = false;
    this.spinVelX = 0;
    this.spinVelY = velY;
  }

  /** Advance rotation from spin velocity and decay back toward idle. */
  private updateSpin(delta: number) {
    if (!this.points || this.dragging) return;
    this.points.rotation.y += this.spinVelY * delta;
    this.points.rotation.x += this.spinVelX * delta;
    // Inertia settles: Y eases to the idle drift, X eases to rest.
    this.spinVelY = dampToward(this.spinVelY, this.idleSpin, SPIN_DECAY, delta);
    this.spinVelX = dampToward(this.spinVelX, 0, SPIN_DECAY, delta);
  }

  /** Set the idle drift speed (rad/s) — lower is calmer (e.g. the Now section). */
  setIdleSpin(speed: number) {
    this.idleSpin = speed;
  }

  /**
   * Replace the morph destination (positions + normals). Each buffer must hold
   * count*3 floats in object space. Does not animate; call morphTo() to play.
   */
  setMorphTarget(target: MorphTarget) {
    if (!this.geometry) return;
    const pairs: Array<[string, Float32Array]> = [
      ['aPositionTarget', target.positions],
      ['aNormalTarget', target.normals],
    ];
    for (const [name, source] of pairs) {
      const attr = this.geometry.getAttribute(name) as THREE.BufferAttribute | undefined;
      if (!attr) continue;
      const dest = attr.array as Float32Array;
      dest.set(source.subarray(0, Math.min(dest.length, source.length)));
      attr.needsUpdate = true;
    }
  }

  /**
   * Animate the master progress toward `to` over `duration` seconds. Under
   * reduced motion it snaps instantly.
   */
  morphTo(to: number, duration = MORPH_DURATION) {
    if (!this.material) return;
    const current = this.material.uniforms.uProgress.value as number;
    if (this.opts.reducedMotion || duration <= 0) {
      this.material.uniforms.uProgress.value = to;
      this.morphing = false;
      if (this.opts.reducedMotion) this.renderOnce();
      return;
    }
    this.progressFrom = current;
    this.progressTo = to;
    this.morphDuration = duration;
    this.morphStartTime = this.elapsed;
    this.morphing = true;
  }

  /** Current master progress (0 = "from" form, 1 = "to" form). */
  get progress(): number {
    return (this.material?.uniforms.uProgress.value as number) ?? 1;
  }

  /** Number of particles in the system. */
  get particleCount(): number {
    return this.opts.count;
  }

  /**
   * High-level morph entry point for the section state machine.
   *
   * Pass a target to form that shape, or null to return to the sphere. Forms
   * morph directly into one another; asking for the form already shown (or
   * already on its way) is a no-op.
   */
  showShape(target: MorphTarget | null) {
    const desired = target ?? this.sphere;
    if (!desired || desired === this.currentTarget) return;
    if (this.progress > 0.001) this.bakeCurrentState();
    this.setMorphTarget(desired);
    this.currentTarget = desired;
    this.morphTo(1);
  }

  /**
   * Fold the in-flight morph into the "from" form: each particle's current
   * staggered position/normal (without the transient noise bulge) becomes its
   * new starting point, and progress resets to 0.
   */
  private bakeCurrentState() {
    if (!this.geometry || !this.material || !this.delays) return;
    const p = this.progress;
    const fromPos = this.geometry.getAttribute('position') as THREE.BufferAttribute;
    const fromNrm = this.geometry.getAttribute('normal') as THREE.BufferAttribute;
    const toPos = this.geometry.getAttribute('aPositionTarget') as THREE.BufferAttribute;
    const toNrm = this.geometry.getAttribute('aNormalTarget') as THREE.BufferAttribute;
    const fp = fromPos.array as Float32Array;
    const fn = fromNrm.array as Float32Array;
    const tp = toPos.array as Float32Array;
    const tn = toNrm.array as Float32Array;
    for (let i = 0; i < this.delays.length; i++) {
      // Mirrors the vertex shader's per-particle staggered progress.
      const local = Math.min(1, Math.max(0, (p - this.delays[i]) / (1 - MORPH_STAGGER)));
      if (local <= 0) continue;
      const j = i * 3;
      fp[j] = lerp(fp[j], tp[j], local);
      fp[j + 1] = lerp(fp[j + 1], tp[j + 1], local);
      fp[j + 2] = lerp(fp[j + 2], tp[j + 2], local);
      const nx = lerp(fn[j], tn[j], local);
      const ny = lerp(fn[j + 1], tn[j + 1], local);
      const nz = lerp(fn[j + 2], tn[j + 2], local);
      const len = Math.hypot(nx, ny, nz);
      if (len > 1e-4) {
        fn[j] = nx / len;
        fn[j + 1] = ny / len;
        fn[j + 2] = nz / len;
      }
    }
    fromPos.needsUpdate = true;
    fromNrm.needsUpdate = true;
    this.material.uniforms.uProgress.value = 0;
    this.morphing = false;
  }

  private updateMorph(elapsed: number) {
    if (!this.morphing || !this.material) return;
    const raw = (elapsed - this.morphStartTime) / this.morphDuration;
    if (raw >= 1) {
      this.material.uniforms.uProgress.value = this.progressTo;
      this.morphing = false;
      return;
    }
    this.material.uniforms.uProgress.value = morphValue(
      raw,
      this.progressFrom,
      this.progressTo,
    );
  }

  /** Update the monochrome particle color (theme changes). Eases smoothly. */
  setColor(hex: string) {
    this.opts.color = hex;
    this.colorTarget.set(hex);
    this.inkTarget = inkFor(this.colorTarget);
    if (this.material && this.opts.reducedMotion) {
      (this.material.uniforms.uColor.value as THREE.Color).set(hex);
      this.material.uniforms.uInk.value = this.inkTarget;
      this.renderOnce();
    }
  }

  /** Ease the active color toward the theme target each frame. */
  private updateColor(delta: number) {
    if (!this.material) return;
    const color = this.material.uniforms.uColor.value as THREE.Color;
    // Frame-rate-independent smoothing (~0.6s settle).
    const k = Math.min(1, delta * 8);
    color.lerp(this.colorTarget, k);
    const ink = this.material.uniforms.uInk;
    ink.value = lerp(ink.value as number, this.inkTarget, k);
  }

  private updateUniforms(elapsed: number) {
    if (!this.material || !this.points) return;
    this.material.uniforms.uTime.value = elapsed;
    const phase = (elapsed / BREATH_PERIOD) * Math.PI * 2;
    this.material.uniforms.uBreath.value =
      1 + BREATH_AMPLITUDE * (1 + Math.sin(phase));
  }

  /** Render one frame using the current accumulated time (static/reduced). */
  renderOnce() {
    if (!this.renderer || !this.scene || !this.camera) return;
    this.updateUniforms(this.elapsed);
    this.renderer.render(this.scene, this.camera);
  }

  private loop = () => {
    if (!this.running || !this.renderer || !this.scene || !this.camera) return;
    // Delta-capped accumulator prevents a spiral-of-death after tab resume.
    const delta = cappedDelta(this.clock.getDelta());
    this.elapsed += delta;
    this.updateUniforms(this.elapsed);
    this.updateCursor();
    this.updateMorph(this.elapsed);
    this.updateColor(delta);
    this.updateSpin(delta);
    this.renderer.render(this.scene, this.camera);
    this.rafId = requestAnimationFrame(this.loop);
  };

  /** Ease the smoothed cursor uniform toward its target (elastic feel). */
  private updateCursor() {
    if (!this.material) return;
    const cursor = this.material.uniforms.uCursor.value as THREE.Vector3;
    cursor.lerp(this.cursorTarget, CURSOR_DAMPING);
    // Attraction is reserved for the ball: fade it out as we morph to a shape.
    const progress = this.material.uniforms.uProgress.value as number;
    const ballFactor =
      this.currentTarget === this.sphere
        ? Math.max(0, 1 - (1 - progress) / BALL_THRESHOLD)
        : 0;
    const u = this.material.uniforms.uCursorStrength;
    u.value = lerp(
      u.value as number,
      this.cursorStrengthTarget * ballFactor,
      CURSOR_DAMPING,
    );
  }

  /** Start the animation loop, or render a single frame if motion is reduced. */
  start() {
    if (!this.supported) return;
    if (this.opts.reducedMotion) {
      this.renderOnce();
      return;
    }
    if (this.running) return;
    this.running = true;
    if (!this.clockStarted) {
      this.clock.start();
      this.clockStarted = true;
    } else {
      // Resuming after a pause: discard the long elapsed gap so the next
      // frame's delta is small (also capped in the loop as a safety net).
      this.clock.getDelta();
    }
    this.rafId = requestAnimationFrame(this.loop);
  }

  stop() {
    this.running = false;
    if (this.rafId != null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /** Release all GPU resources. Safe to call multiple times. */
  dispose() {
    this.stop();
    this.geometry?.dispose();
    this.material?.dispose();
    if (this.renderer) {
      // Free the GPU context slot BEFORE disposing internal state so the
      // browser can immediately reclaim it (important on hot-reload).
      this.renderer.forceContextLoss?.();
      this.renderer.dispose();
    }
    this.geometry = null;
    this.material = null;
    this.points = null;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
  }
}

/** 1 for dark grain (ink on a light page), 0 for light grain on a dark page. */
function inkFor(color: THREE.Color): number {
  return color.r * 0.299 + color.g * 0.587 + color.b * 0.114 < 0.5 ? 1 : 0;
}
