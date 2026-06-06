import { describe, it, expect } from 'vitest';
import {
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
