/**
 * Per-section stage choreography. Each section gives the particle stage its own
 * "spot": where it sits (cx/cy as fractions of the viewport), how large it is
 * (scale), and how present it is (opacity / prominence). The component eases the
 * stage from one placement to the next as the active section changes — so each
 * model arrives as "its own thing" (enter + fade) at a smooth, deliberate pace.
 *
 * DOM-free and unit-tested; the component maps fractions → pixels and applies a
 * CSS transform.
 */

export interface Placement {
  /** Stage center X as a fraction of viewport width. */
  cx: number;
  /** Stage center Y as a fraction of viewport height. */
  cy: number;
  /** Uniform scale relative to the base stage size. */
  scale: number;
  /** Stage opacity (prominence). */
  opacity: number;
}

/**
 * Easing rate for the placement follow (dampToward lambda). Lower = slower/
 * smoother. Tuned to feel like the ~1.8s morph — deliberate, not snappy.
 */
export const PLACEMENT_LAMBDA = 3.2;

/**
 * Section → placement. Hero and footer are centered and prominent (the bonsai
 * open/close); work/now/connect are lowkey companions to the side; projects is
 * prominent (it settles left with a carousel in a later pass, but stays on the
 * right rail until then so nothing overlaps).
 */
/**
 * Section → placement. Hero, Connect and Footer center the orb (the bonsai
 * bookends: living → shedding cherry → brass). The working middle alternates
 * sides for rhythm — Work right, Projects left (carousel needs the width), Now
 * right — while holding a constant vertical center so the orb sweeps calmly.
 * Projects is the prominent centerpiece; Work/Now are quieter companions.
 */
export const PLACEMENTS: Record<string, Placement> = {
  hero: { cx: 0.5, cy: 0.4, scale: 0.82, opacity: 1 },
  work: { cx: 0.76, cy: 0.5, scale: 0.42, opacity: 0.85 },
  projects: { cx: 0.24, cy: 0.5, scale: 0.58, opacity: 1 },
  now: { cx: 0.76, cy: 0.5, scale: 0.46, opacity: 0.8 },
  // Connect + Footer: a locked side-rail companion (not centered — it would
  // overlap the closing content). Identical placement → the orb stays put and
  // only morphs (cherry → brass).
  connect: { cx: 0.78, cy: 0.47, scale: 0.46, opacity: 0.9 },
  footer: { cx: 0.78, cy: 0.47, scale: 0.46, opacity: 0.9 },
  lore: { cx: 0.78, cy: 0.48, scale: 0.42, opacity: 0.82 },
};

export const DEFAULT_PLACEMENT: Placement = PLACEMENTS.hero;

/** Resolve a section id to its placement, falling back to the hero placement. */
export function placementFor(id: string): Placement {
  return PLACEMENTS[id] ?? DEFAULT_PLACEMENT;
}

export interface PlacementPixels {
  x: number;
  y: number;
  scale: number;
  opacity: number;
}

/** Map a placement's viewport fractions to pixel coordinates. */
export function placementPixels(
  p: Placement,
  vw: number,
  vh: number,
): PlacementPixels {
  return { x: p.cx * vw, y: p.cy * vh, scale: p.scale, opacity: p.opacity };
}

export interface BoundaryClampOptions {
  /** Desired stage center Y in viewport pixels. */
  targetY: number;
  /** Top edge of the boundary element in viewport pixels. */
  boundaryTop: number;
  /** Current viewport height in pixels. */
  viewportHeight: number;
  /** Unscaled square stage size in pixels. */
  stageSize: number;
  /** Current stage scale. */
  scale: number;
  /** Extra visual footprint beyond the stage, e.g. the scrim halo scale. */
  footprintScale?: number;
  /** Minimum gap between the visual footprint and the boundary. */
  margin?: number;
  /** Lowest allowed center as a viewport fraction when the boundary is tight. */
  minCenterRatio?: number;
}

/**
 * Keep the particle stage's full visual footprint above a boundary such as the
 * footer. This clamps the scrim/halo too, not just the canvas ring.
 */
export function clampYAboveBoundary({
  targetY,
  boundaryTop,
  viewportHeight,
  stageSize,
  scale,
  footprintScale = 1,
  margin = 128,
  minCenterRatio = 0.1,
}: BoundaryClampOptions): number {
  const visualHalf = stageSize * scale * footprintScale * 0.5;
  const maxY = boundaryTop - visualHalf - margin;
  if (maxY >= targetY) return targetY;
  return Math.max(viewportHeight * minCenterRatio, maxY);
}

export interface SectionLockOptions {
  /** Desired stage center Y in viewport pixels while the section is arriving. */
  targetY: number;
  /** Section top from getBoundingClientRect().top. */
  sectionTop: number;
  /** Viewport Y where the section starts carrying the orb with it. */
  lockTop?: number;
}

/**
 * Once a short ending section has crossed its ideal frame, carry the orb with
 * that section instead of letting the fixed stage drift into the next region.
 */
export function lockYToSectionTop({
  targetY,
  sectionTop,
  lockTop = 0,
}: SectionLockOptions): number {
  if (sectionTop >= lockTop) return targetY;
  return targetY + sectionTop - lockTop;
}
