/**
 * Pure performance helpers for the particle system. Kept dependency-free and
 * unit-tested so the tiering/timing policy is verifiable without a browser.
 */

export const PARTICLE_COUNT_DESKTOP = 13000;
export const PARTICLE_COUNT_MOBILE = 5000;
export const MOBILE_MAX_WIDTH = 767;

/** Max frame delta in seconds — prevents spiral-of-death after tab resume. */
export const MAX_FRAME_DELTA = 0.032;

/** Pick a particle count tier from the viewport width. */
export function particleCountForWidth(width: number): number {
  return width <= MOBILE_MAX_WIDTH ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
}

/** Clamp a frame delta (seconds) to a sane maximum; never negative. */
export function cappedDelta(dt: number, max = MAX_FRAME_DELTA): number {
  if (!Number.isFinite(dt) || dt < 0) return 0;
  return dt > max ? max : dt;
}
