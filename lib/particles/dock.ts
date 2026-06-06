/**
 * Pure geometry for the "hero stage → docked companion" transition.
 *
 * The particle sphere lives in a contained square stage (circular ring). In the
 * hero it's large and centered; as the user scrolls past the hero it eases to a
 * smaller position in the right rail. These helpers are DOM-free and tested;
 * the component applies the result as a CSS transform on the stage element.
 */

import { clamp, cubicInOut, lerp } from './math';

export const DOCK_SCALE = 0.42; // docked size relative to hero stage
export const DOCK_CENTER_X = 0.8; // docked stage center as a fraction of vw
export const HERO_CENTER_Y = 0.46; // hero stage vertical center (fraction of vh)

/** Linear dock progress 0..1 from scroll position over the hero height. */
export function dockProgress(scrollY: number, heroHeight: number): number {
  if (heroHeight <= 0) return 0;
  return clamp(scrollY / heroHeight, 0, 1);
}

/** Base stage size (px) for the hero presentation, clamped for small/large screens. */
export function stageBaseSize(vw: number, vh: number): number {
  return Math.max(300, Math.min(720, Math.min(vw, vh) * 0.72));
}

export interface StageGeometry {
  /** Stage center X in px. */
  x: number;
  /** Stage center Y in px. */
  y: number;
  /** Uniform scale applied to the base stage size. */
  scale: number;
}

/**
 * Stage center + scale for a given dock progress. p=0 → large, centered hero
 * stage; p=1 → small, right-rail docked companion. Eased with cubic-in-out.
 */
export function stageGeometry(
  p: number,
  vw: number,
  vh: number,
): StageGeometry {
  const e = cubicInOut(clamp(p, 0, 1));
  const scale = lerp(1, DOCK_SCALE, e);
  const heroX = vw * 0.5;
  const heroY = vh * HERO_CENTER_Y;
  const dockX = vw * DOCK_CENTER_X;
  const dockY = vh * 0.5;
  return {
    x: lerp(heroX, dockX, e),
    y: lerp(heroY, dockY, e),
    scale,
  };
}
