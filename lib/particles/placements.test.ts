import { describe, it, expect } from 'vitest';
import {
  clampYAboveBoundary,
  lockYToSectionTop,
  placementFor,
  placementPixels,
  PLACEMENTS,
  DEFAULT_PLACEMENT,
} from './placements';

describe('placementFor', () => {
  it('returns the configured placement for known sections', () => {
    expect(placementFor('hero')).toBe(PLACEMENTS.hero);
    expect(placementFor('projects')).toBe(PLACEMENTS.projects);
    expect(placementFor('footer')).toBe(PLACEMENTS.footer);
  });

  it('falls back to the hero placement for unknown sections', () => {
    expect(placementFor('nope')).toBe(DEFAULT_PLACEMENT);
  });

  it('keeps hero/footer centered and prominent, sides lowkey', () => {
    expect(PLACEMENTS.hero.cx).toBeCloseTo(0.5, 6);
    expect(PLACEMENTS.work.cx).toBeGreaterThan(0.5); // to the side
    expect(PLACEMENTS.work.opacity).toBeLessThan(1); // lowkey
    expect(PLACEMENTS.hero.scale).toBeGreaterThan(PLACEMENTS.work.scale);
    // Connect and Footer share one locked side-rail placement.
    expect(PLACEMENTS.connect).toEqual(PLACEMENTS.footer);
    expect(PLACEMENTS.footer.cx).toBeGreaterThan(0.5);
    expect(PLACEMENTS.connect.cy).toBeLessThan(0.5);
    expect(PLACEMENTS.lore.cx).toBeGreaterThan(0.5);
    expect(PLACEMENTS.lore.scale).toBeLessThan(PLACEMENTS.connect.scale);
  });
});

describe('placementPixels', () => {
  it('maps viewport fractions to pixels', () => {
    const px = placementPixels({ cx: 0.5, cy: 0.4, scale: 0.8, opacity: 0.9 }, 1000, 800);
    expect(px.x).toBe(500);
    expect(px.y).toBe(320);
    expect(px.scale).toBe(0.8);
    expect(px.opacity).toBe(0.9);
  });
});

describe('clampYAboveBoundary', () => {
  it('leaves the target alone when the full footprint clears the boundary', () => {
    expect(
      clampYAboveBoundary({
        targetY: 400,
        boundaryTop: 860,
        viewportHeight: 900,
        stageSize: 600,
        scale: 0.5,
        footprintScale: 1.35,
      }),
    ).toBe(400);
  });

  it('clamps using the expanded visual footprint, not just the stage ring', () => {
    const clamped = clampYAboveBoundary({
      targetY: 400,
      boundaryTop: 550,
      viewportHeight: 900,
      stageSize: 600,
      scale: 0.5,
      footprintScale: 1.35,
      margin: 16,
    });

    expect(clamped).toBeCloseTo(550 - (600 * 0.5 * 1.35) / 2 - 16, 6);
    expect(clamped).toBeLessThan(550 - (600 * 0.5) / 2 - 16);
  });

  it('keeps an extreme clamp inside the viewport floor', () => {
    expect(
      clampYAboveBoundary({
        targetY: 400,
        boundaryTop: 80,
        viewportHeight: 900,
        stageSize: 600,
        scale: 0.5,
        footprintScale: 1.35,
      }),
    ).toBe(90);
  });
});

describe('lockYToSectionTop', () => {
  it('leaves the target alone before the section crosses the lock line', () => {
    expect(lockYToSectionTop({ targetY: 400, sectionTop: 80 })).toBe(400);
    expect(lockYToSectionTop({ targetY: 400, sectionTop: 0 })).toBe(400);
  });

  it('carries the target upward with the section after it crosses the lock line', () => {
    expect(lockYToSectionTop({ targetY: 400, sectionTop: -120 })).toBe(280);
  });

  it('supports a custom lock line', () => {
    expect(lockYToSectionTop({ targetY: 400, sectionTop: 40, lockTop: 64 })).toBe(376);
  });
});
