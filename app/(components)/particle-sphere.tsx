'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useReducedMotion } from 'framer-motion';
import { ParticleSystem } from '@/lib/particles/ParticleSystem';
import { screenToNdc, dampToward } from '@/lib/particles/math';
import { particleCountForWidth, cappedDelta } from '@/lib/particles/perf';
import { stageBaseSize } from '@/lib/particles/dock';
import {
  placementFor,
  placementPixels,
  PLACEMENT_LAMBDA,
  type PlacementPixels,
} from '@/lib/particles/placements';
import { loadGLB } from '@/lib/particles/loadTarget';
import { SECTION_TARGETS, targetConfigFor, modelUrl } from '@/lib/particles/section-targets';
import { useScrollSection } from '@/lib/hooks/useScrollSection';

const COLORS = { light: '#1a1a1a', dark: '#e8e8e8' } as const;
const DESKTOP_MIN = 768;
const SCRIM_SCALE = 1.35; // dimming halo extends a bit past the orb
const HIT_RADIUS = 0.44; // central fraction of the orb that captures drag

function colorFor(theme: string | undefined): string {
  return theme === 'light' ? COLORS.light : COLORS.dark;
}

/** Where the stage should be heading, in pixels, given the active section. */
function targetPixels(
  activeId: string,
  isDesktop: boolean,
  vw: number,
  vh: number,
): PlacementPixels {
  if (!isDesktop) {
    // Mobile: centered, smaller, faint — choreography disabled.
    return { x: vw * 0.5, y: vh * 0.48, scale: 0.7, opacity: 0.45 };
  }
  return placementPixels(placementFor(activeId), vw, vh);
}

/**
 * Particle orb in a contained circular stage. The orb renders ABOVE the page
 * content and a soft scrim dims whatever content sits beneath it — so the orb
 * reads cleanly and content "fades under it" as the orb transits (per the
 * design sketch). As the active section changes, the stage eases (position +
 * scale + opacity) to that section's placement. Drag the orb's core to spin it.
 */
export function ParticleSphere() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const scrimRef = useRef<HTMLDivElement | null>(null);
  const systemRef = useRef<ParticleSystem | null>(null);
  const buffersRef = useRef<Map<string, Float32Array>>(new Map());
  const activeRef = useRef<string>('hero');

  const { resolvedTheme } = useTheme();
  const reducedMotion = useReducedMotion();
  const { activeId } = useScrollSection();

  useEffect(() => {
    const stage = stageRef.current;
    const scrim = scrimRef.current;
    if (!stage || !scrim) return;

    const isDesktop = window.innerWidth >= DESKTOP_MIN;

    // Fresh canvas per run — never reuse one whose context was force-lost.
    const canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.borderRadius = '50%';
    canvas.style.cursor = 'grab';
    // Only the orb's core captures pointer events; edges let content through.
    canvas.style.clipPath = `circle(${HIT_RADIUS * 100}%)`;
    canvas.style.pointerEvents = 'auto';
    stage.appendChild(canvas);

    const system = new ParticleSystem(canvas, {
      reducedMotion: !!reducedMotion,
      color: colorFor(resolvedTheme),
      count: particleCountForWidth(window.innerWidth),
    });
    systemRef.current = system;

    let detach = () => {};

    // Current eased stage state (pixels). Start at the hero placement.
    const init = targetPixels('hero', isDesktop, window.innerWidth, window.innerHeight);
    let curX = init.x;
    let curY = init.y;
    let curScale = init.scale;
    let curOpacity = init.opacity;

    // Skip DOM writes once the orb has settled (no per-frame layout/paint).
    let lastX = NaN;
    let lastY = NaN;
    let lastScale = NaN;
    let lastOpacity = NaN;
    const writeStage = () => {
      if (
        Math.abs(curX - lastX) < 0.05 &&
        Math.abs(curY - lastY) < 0.05 &&
        Math.abs(curScale - lastScale) < 0.0005 &&
        Math.abs(curOpacity - lastOpacity) < 0.002
      ) {
        return;
      }
      lastX = curX;
      lastY = curY;
      lastScale = curScale;
      lastOpacity = curOpacity;
      stage.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%) scale(${curScale})`;
      stage.style.opacity = `${curOpacity}`;
      scrim.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%) scale(${curScale * SCRIM_SCALE})`;
      scrim.style.opacity = `${curOpacity * 0.85}`;
    };

    const sizeStage = () => {
      const size = stageBaseSize(window.innerWidth, window.innerHeight);
      stage.style.width = `${size}px`;
      stage.style.height = `${size}px`;
      scrim.style.width = `${size}px`;
      scrim.style.height = `${size}px`;
      system.setSize(size, size, window.devicePixelRatio || 1);
    };

    // Mobile: orb sits behind content as a faint backdrop (no fade scrim, no dock).
    if (!isDesktop) {
      stage.style.zIndex = '0';
      scrim.style.display = 'none';
    }

    sizeStage();
    writeStage();

    if (system.supported) {
      system.start();

      // Placement easing loop — eases the stage toward the active section's spot.
      let easeFrame: number | null = null;
      let lastT = performance.now();
      let easing = false;
      const tick = (now: number) => {
        const dt = cappedDelta((now - lastT) / 1000);
        lastT = now;
        const t = targetPixels(
          activeRef.current,
          isDesktop,
          window.innerWidth,
          window.innerHeight,
        );
        curX = dampToward(curX, t.x, PLACEMENT_LAMBDA, dt);
        curY = dampToward(curY, t.y, PLACEMENT_LAMBDA, dt);
        curScale = dampToward(curScale, t.scale, PLACEMENT_LAMBDA, dt);
        curOpacity = dampToward(curOpacity, t.opacity, PLACEMENT_LAMBDA, dt);
        writeStage();
        if (easing) easeFrame = requestAnimationFrame(tick);
      };
      const startEasing = () => {
        if (easing) return;
        easing = true;
        lastT = performance.now();
        easeFrame = requestAnimationFrame(tick);
      };
      const stopEasing = () => {
        easing = false;
        if (easeFrame != null) cancelAnimationFrame(easeFrame);
        easeFrame = null;
      };
      if (!reducedMotion) startEasing();

      const onResize = () => sizeStage();
      window.addEventListener('resize', onResize);

      // Pointer: drag to spin, hover to attract (ball state). Desktop only.
      const finePointer =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(pointer: fine)').matches;

      let dragging = false;
      const onPointerDown = (e: PointerEvent) => {
        dragging = true;
        system.spinStart();
        canvas.style.cursor = 'grabbing';
        canvas.setPointerCapture?.(e.pointerId);
      };
      const onPointerMove = (e: PointerEvent) => {
        if (dragging) {
          system.spinBy(e.movementX, e.movementY);
          return;
        }
        const rect = canvas.getBoundingClientRect();
        const { x, y } = screenToNdc(
          e.clientX - rect.left,
          e.clientY - rect.top,
          rect.width,
          rect.height,
        );
        system.setCursor(x, y, true);
      };
      const endDrag = (e: PointerEvent) => {
        if (!dragging) return;
        dragging = false;
        system.spinEnd();
        canvas.style.cursor = 'grab';
        canvas.releasePointerCapture?.(e.pointerId);
      };
      const onPointerLeave = () => {
        if (!dragging) system.setCursor(0, 0, false);
      };

      if (finePointer && !reducedMotion) {
        canvas.addEventListener('pointerdown', onPointerDown);
        canvas.addEventListener('pointermove', onPointerMove);
        canvas.addEventListener('pointerup', endDrag);
        canvas.addEventListener('pointerleave', onPointerLeave);
      }

      const onVisibility = () => {
        if (document.hidden) {
          system.stop();
          stopEasing();
        } else {
          system.start();
          startEasing();
        }
      };
      if (!reducedMotion) document.addEventListener('visibilitychange', onVisibility);

      // Preload section models (real .glb only; missing → stays sphere).
      let cancelled = false;
      if (!reducedMotion) {
        for (const id of Object.keys(SECTION_TARGETS)) {
          const cfg = targetConfigFor(id);
          if (!cfg.model) continue;
          loadGLB(modelUrl(cfg.model), system.particleCount)
            .then((buf) => {
              if (cancelled) return;
              buffersRef.current.set(id, buf);
              if (activeRef.current === id) system.showShape(buf);
            })
            .catch(() => {});
        }
      }

      detach = () => {
        cancelled = true;
        stopEasing();
        window.removeEventListener('resize', onResize);
        canvas.removeEventListener('pointerdown', onPointerDown);
        canvas.removeEventListener('pointermove', onPointerMove);
        canvas.removeEventListener('pointerup', endDrag);
        canvas.removeEventListener('pointerleave', onPointerLeave);
        document.removeEventListener('visibilitychange', onVisibility);
      };
    }

    return () => {
      detach();
      system.dispose();
      systemRef.current = null;
      canvas.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  // Drive the morph state machine from the active scroll section.
  useEffect(() => {
    const prev = activeRef.current;
    activeRef.current = activeId;
    const system = systemRef.current;
    if (!system || !system.supported || reducedMotion) return;
    const cfg = targetConfigFor(activeId);
    if (!cfg.model) {
      system.showShape(null);
      return;
    }
    system.showShape(buffersRef.current.get(activeId) ?? null);
    // Spin into the new section — direction follows the orb's horizontal travel
    // (moving right spins one way, moving left the other). Same feel as Projects.
    if (prev !== activeId) {
      const dx = placementFor(activeId).cx - placementFor(prev).cx;
      const dir = dx > 0.001 ? -1 : dx < -0.001 ? 1 : 1;
      system.spinImpulse(10 * dir);
    }
    // Calmer drift in the contemplative sections (zen feel).
    const zen = activeId === 'now' || activeId === 'connect' || activeId === 'footer';
    system.setIdleSpin(zen ? 0.05 : 0.12);
  }, [activeId, reducedMotion]);

  // Update color on theme change without rebuilding the scene.
  useEffect(() => {
    systemRef.current?.setColor(colorFor(resolvedTheme));
  }, [resolvedTheme]);

  // AFK: after ~20s of no interaction, ease to the living bonsai; restore on activity.
  useEffect(() => {
    if (reducedMotion || typeof window === 'undefined') return;
    const IDLE_MS = 20000;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let idle = false;

    const restoreActive = () => {
      const system = systemRef.current;
      if (!system?.supported) return;
      const cfg = targetConfigFor(activeRef.current);
      system.showShape(cfg.model ? buffersRef.current.get(activeRef.current) ?? null : null);
    };
    const goIdle = () => {
      const system = systemRef.current;
      if (!system?.supported) return;
      // Already the living bonsai on the hero — nothing to ease to.
      if (activeRef.current === 'hero') return;
      idle = true;
      system.setIdleSpin(0.05);
      system.showShape(buffersRef.current.get('hero') ?? null); // living bonsai
    };
    const wake = () => {
      if (idle) {
        idle = false;
        restoreActive();
      }
      if (timer) clearTimeout(timer);
      timer = setTimeout(goIdle, IDLE_MS);
    };

    const opts: AddEventListenerOptions = { passive: true };
    window.addEventListener('pointermove', wake, opts);
    window.addEventListener('pointerdown', wake, opts);
    window.addEventListener('scroll', wake, opts);
    window.addEventListener('touchstart', wake, opts);
    window.addEventListener('keydown', wake);
    timer = setTimeout(goIdle, IDLE_MS);

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('pointermove', wake);
      window.removeEventListener('pointerdown', wake);
      window.removeEventListener('scroll', wake);
      window.removeEventListener('touchstart', wake);
      window.removeEventListener('keydown', wake);
    };
  }, [reducedMotion]);

  return (
    <>
      {/* Dimming scrim — fades page content beneath the orb. */}
      <div
        ref={scrimRef}
        className="pointer-events-none fixed left-0 top-0 z-20 rounded-full"
        style={{
          background:
            'radial-gradient(circle, var(--bg) 0%, var(--bg) 34%, transparent 70%)',
        }}
        aria-hidden="true"
      />
      {/* The orb stage — rendered above content. */}
      <div
        ref={stageRef}
        className="pointer-events-none fixed left-0 top-0 z-30 rounded-full"
        style={{ border: '1px solid var(--border)' }}
        aria-hidden="true"
      />
    </>
  );
}
