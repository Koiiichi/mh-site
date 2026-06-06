/**
 * Pure, framework-agnostic geometry/math utilities for the particle system.
 *
 * These are deliberately dependency-free and side-effect-free so they can be
 * unit-tested in isolation (no three.js, no DOM). three.js consumes the
 * Float32Array outputs directly as buffer attributes.
 */

/**
 * Generate `n` points evenly distributed on a sphere surface using the
 * Fibonacci / golden-angle method. Returns a flat Float32Array [x,y,z, ...]
 * of length n*3 ready to drop into a THREE.BufferAttribute.
 */
export function fibonacciSphere(n: number, radius = 1): Float32Array {
  const out = new Float32Array(Math.max(0, n) * 3);
  if (n <= 0) return out;

  const goldenAngle = Math.PI * (Math.sqrt(5) - 1); // ~2.39996 rad
  // Avoid division by zero when n === 1.
  const denom = Math.max(n - 1, 1);

  for (let i = 0; i < n; i++) {
    const y = n === 1 ? 0 : 1 - (i / denom) * 2; // y in [-1, 1]
    const r = Math.sqrt(Math.max(0, 1 - y * y)); // radius of the ring at height y
    const theta = goldenAngle * i;
    out[i * 3] = Math.cos(theta) * r * radius;
    out[i * 3 + 1] = y * radius;
    out[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
  return out;
}

/** Clamp helper. */
export function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}

/** Linear interpolation. t is not clamped. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Eased morph value for the master progress scalar. `rawT` is the linear
 * timeline 0..1 (elapsed/duration); the result eases between `from` and `to`
 * with cubic-in-out. Used to drive the single uProgress uniform in the loop.
 */
export function morphValue(rawT: number, from: number, to: number): number {
  return lerp(from, to, cubicInOut(rawT));
}

/**
 * Convert screen/client coordinates to normalized device coordinates (NDC),
 * where x,y are in [-1, 1] with y pointing up (WebGL convention).
 */
export function screenToNdc(
  clientX: number,
  clientY: number,
  width: number,
  height: number,
): { x: number; y: number } {
  const w = width || 1;
  const h = height || 1;
  return {
    x: (clientX / w) * 2 - 1,
    y: -((clientY / h) * 2 - 1),
  };
}

/**
 * Cubic ease-in-out. Input is clamped to [0, 1]. f(0)=0, f(1)=1, f(0.5)=0.5.
 */
export function cubicInOut(t: number): number {
  const x = clamp(t, 0, 1);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

/**
 * Recenter a point cloud on its bounding-box center and uniformly scale it so
 * that its farthest point lands exactly on `targetRadius`. Returns a new
 * Float32Array; the input is not mutated.
 *
 * This is what lets arbitrarily-scaled Sketchfab .glb exports become
 * consistent morph targets regardless of their source units.
 */
export function normalizeToUnitSphere(
  positions: Float32Array,
  targetRadius = 1,
): Float32Array {
  const count = positions.length / 3;
  const out = new Float32Array(positions.length);
  if (count === 0) return out;

  let minX = Infinity;
  let minY = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxZ = -Infinity;

  for (let i = 0; i < count; i++) {
    const x = positions[i * 3];
    const y = positions[i * 3 + 1];
    const z = positions[i * 3 + 2];
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (z < minZ) minZ = z;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
    if (z > maxZ) maxZ = z;
  }

  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const cz = (minZ + maxZ) / 2;

  // Farthest distance from the (new) center.
  let maxDist = 0;
  for (let i = 0; i < count; i++) {
    const dx = positions[i * 3] - cx;
    const dy = positions[i * 3 + 1] - cy;
    const dz = positions[i * 3 + 2] - cz;
    const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (d > maxDist) maxDist = d;
  }

  const scale = maxDist > 1e-8 ? targetRadius / maxDist : 1;

  for (let i = 0; i < count; i++) {
    out[i * 3] = (positions[i * 3] - cx) * scale;
    out[i * 3 + 1] = (positions[i * 3 + 1] - cy) * scale;
    out[i * 3 + 2] = (positions[i * 3 + 2] - cz) * scale;
  }
  return out;
}

/**
 * Build a 0/1 mask marking ~`ratio` of `count` particles as chromatic accents.
 * Deterministic for a given seed.
 */
export function accentMask(count: number, ratio: number, seed: number): Float32Array {
  const rng = mulberry32(seed);
  const out = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    out[i] = rng() < ratio ? 1 : 0;
  }
  return out;
}

/**
 * mulberry32 — a tiny, fast, deterministic 32-bit PRNG. Given the same seed it
 * always yields the same sequence, which keeps particle delays/assignments
 * stable across renders and reproducible in tests.
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Deterministic Fisher-Yates permutation of indices 0..n-1 for a given seed.
 * Used to assign each particle a target vertex without clustering.
 */
export function shuffledIndices(n: number, seed: number): number[] {
  const rng = mulberry32(seed);
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}
