import { describe, it, expect } from 'vitest';
import {
  dockProgress,
  stageBaseSize,
  stageGeometry,
  DOCK_SCALE,
} from './dock';

describe('dockProgress', () => {
  it('is 0 at the top and 1 past the hero', () => {
    expect(dockProgress(0, 800)).toBe(0);
    expect(dockProgress(800, 800)).toBe(1);
    expect(dockProgress(1600, 800)).toBe(1);
  });

  it('is monotonic through the hero', () => {
    expect(dockProgress(400, 800)).toBeCloseTo(0.5, 6);
  });

  it('guards against zero hero height', () => {
    expect(dockProgress(100, 0)).toBe(0);
  });
});

describe('stageBaseSize', () => {
  it('scales with the smaller viewport dimension, clamped', () => {
    expect(stageBaseSize(1440, 900)).toBeCloseTo(648, 0); // 900*0.72
    expect(stageBaseSize(4000, 4000)).toBe(720); // upper clamp
    expect(stageBaseSize(320, 320)).toBe(300); // lower clamp
  });
});

describe('stageGeometry', () => {
  const vw = 1440;
  const vh = 900;

  it('hero state: centered, full scale', () => {
    const g = stageGeometry(0, vw, vh);
    expect(g.x).toBeCloseTo(vw * 0.5, 3);
    expect(g.scale).toBeCloseTo(1, 6);
  });

  it('docked state: right rail (not the edge), reduced scale', () => {
    const g = stageGeometry(1, vw, vh);
    expect(g.scale).toBeCloseTo(DOCK_SCALE, 6);
    expect(g.x).toBeGreaterThan(vw * 0.5); // moved right
    expect(g.x).toBeLessThan(vw * 0.95); // pulled in from the extreme edge
    expect(g.y).toBeCloseTo(vh * 0.5, 3);
  });

  it('eases scale monotonically down as it docks', () => {
    const a = stageGeometry(0.25, vw, vh).scale;
    const b = stageGeometry(0.75, vw, vh).scale;
    expect(a).toBeGreaterThan(b);
    expect(b).toBeGreaterThan(DOCK_SCALE - 1e-6);
  });
});
