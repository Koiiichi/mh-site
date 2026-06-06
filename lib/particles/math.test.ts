import { describe, it, expect } from 'vitest';
import {
  fibonacciSphere,
  cubicInOut,
  normalizeToUnitSphere,
  mulberry32,
  shuffledIndices,
  lerp,
  screenToNdc,
  morphValue,
  accentMask,
} from './math';

function distFromOrigin(buf: Float32Array, i: number): number {
  const x = buf[i * 3];
  const y = buf[i * 3 + 1];
  const z = buf[i * 3 + 2];
  return Math.sqrt(x * x + y * y + z * z);
}

describe('fibonacciSphere', () => {
  it('returns a flat Float32Array of length n*3', () => {
    const pts = fibonacciSphere(500, 1);
    expect(pts).toBeInstanceOf(Float32Array);
    expect(pts.length).toBe(500 * 3);
  });

  it('places every point on the sphere surface at the given radius', () => {
    const radius = 2.5;
    const n = 1000;
    const pts = fibonacciSphere(n, radius);
    for (let i = 0; i < n; i++) {
      expect(distFromOrigin(pts, i)).toBeCloseTo(radius, 4);
    }
  });

  it('spreads points evenly (centroid is near origin)', () => {
    const n = 2000;
    const pts = fibonacciSphere(n, 1);
    let cx = 0;
    let cy = 0;
    let cz = 0;
    for (let i = 0; i < n; i++) {
      cx += pts[i * 3];
      cy += pts[i * 3 + 1];
      cz += pts[i * 3 + 2];
    }
    cx /= n;
    cy /= n;
    cz /= n;
    // A well-distributed sphere surface has a centroid very close to the origin.
    expect(Math.abs(cx)).toBeLessThan(0.05);
    expect(Math.abs(cy)).toBeLessThan(0.05);
    expect(Math.abs(cz)).toBeLessThan(0.05);
  });

  it('handles the n=1 edge case without NaN', () => {
    const pts = fibonacciSphere(1, 1);
    expect(pts.length).toBe(3);
    expect(Number.isNaN(pts[0])).toBe(false);
    expect(Number.isNaN(pts[1])).toBe(false);
    expect(Number.isNaN(pts[2])).toBe(false);
    expect(distFromOrigin(pts, 0)).toBeCloseTo(1, 4);
  });
});

describe('cubicInOut', () => {
  it('maps the endpoints exactly', () => {
    expect(cubicInOut(0)).toBe(0);
    expect(cubicInOut(1)).toBe(1);
  });

  it('is symmetric about the midpoint', () => {
    expect(cubicInOut(0.5)).toBeCloseTo(0.5, 6);
  });

  it('clamps out-of-range input', () => {
    expect(cubicInOut(-1)).toBe(0);
    expect(cubicInOut(2)).toBe(1);
  });

  it('is monotonically increasing', () => {
    let prev = -Infinity;
    for (let t = 0; t <= 1.0001; t += 0.05) {
      const v = cubicInOut(t);
      expect(v).toBeGreaterThanOrEqual(prev);
      prev = v;
    }
  });
});

describe('normalizeToUnitSphere', () => {
  it('recenters and scales an off-center, oversized cloud to the target radius', () => {
    // A small cube offset far from origin.
    const raw = new Float32Array([
      10, 10, 10, 12, 10, 10, 10, 12, 10, 10, 10, 12, 12, 12, 12,
    ]);
    const out = normalizeToUnitSphere(raw, 1);
    const n = out.length / 3;
    let maxR = 0;
    let cx = 0;
    for (let i = 0; i < n; i++) {
      maxR = Math.max(maxR, distFromOrigin(out, i));
      cx += out[i * 3];
    }
    // Farthest point sits on the unit radius.
    expect(maxR).toBeCloseTo(1, 4);
    // Bounding-box center moved to the origin.
    expect(Math.abs(cx / n)).toBeLessThan(0.6); // centroid need not be exactly 0 for a cube corner
    expect(maxR).toBeLessThanOrEqual(1 + 1e-4);
  });

  it('respects a custom target radius', () => {
    const raw = new Float32Array([0, 0, 0, 4, 0, 0]);
    const out = normalizeToUnitSphere(raw, 3);
    let maxR = 0;
    for (let i = 0; i < out.length / 3; i++) {
      maxR = Math.max(maxR, distFromOrigin(out, i));
    }
    expect(maxR).toBeCloseTo(3, 4);
  });

  it('does not divide by zero for a single coincident point', () => {
    const raw = new Float32Array([5, 5, 5]);
    const out = normalizeToUnitSphere(raw, 1);
    expect(Number.isNaN(out[0])).toBe(false);
  });
});

describe('mulberry32', () => {
  it('is deterministic for the same seed', () => {
    const a = mulberry32(12345);
    const b = mulberry32(12345);
    for (let i = 0; i < 10; i++) {
      expect(a()).toBe(b());
    }
  });

  it('produces values in [0, 1)', () => {
    const rng = mulberry32(7);
    for (let i = 0; i < 100; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('produces different sequences for different seeds', () => {
    const a = mulberry32(1);
    const b = mulberry32(2);
    expect(a()).not.toBe(b());
  });
});

describe('shuffledIndices', () => {
  it('returns a valid permutation of 0..n-1', () => {
    const n = 50;
    const idx = shuffledIndices(n, 99);
    expect(idx.length).toBe(n);
    const sorted = [...idx].sort((x, y) => x - y);
    expect(sorted).toEqual(Array.from({ length: n }, (_, i) => i));
  });

  it('is deterministic for the same seed', () => {
    expect(shuffledIndices(20, 42)).toEqual(shuffledIndices(20, 42));
  });

  it('differs for different seeds', () => {
    expect(shuffledIndices(100, 1)).not.toEqual(shuffledIndices(100, 2));
  });
});

describe('lerp', () => {
  it('returns endpoints at t=0 and t=1', () => {
    expect(lerp(2, 10, 0)).toBe(2);
    expect(lerp(2, 10, 1)).toBe(10);
  });

  it('interpolates the midpoint', () => {
    expect(lerp(0, 8, 0.25)).toBe(2);
  });
});

describe('morphValue', () => {
  it('hits both endpoints', () => {
    expect(morphValue(0, 0, 1)).toBe(0);
    expect(morphValue(1, 0, 1)).toBe(1);
  });

  it('eases symmetrically at the midpoint (forward and reverse)', () => {
    expect(morphValue(0.5, 0, 1)).toBeCloseTo(0.5, 6);
    expect(morphValue(0.5, 1, 0)).toBeCloseTo(0.5, 6);
  });

  it('supports reverse morphs (1 -> 0)', () => {
    expect(morphValue(0, 1, 0)).toBe(1);
    expect(morphValue(1, 1, 0)).toBe(0);
  });
});

describe('accentMask', () => {
  it('marks roughly the requested ratio of particles', () => {
    const count = 10000;
    const mask = accentMask(count, 0.05, 3);
    const ones = mask.reduce((a, b) => a + b, 0);
    const fraction = ones / count;
    expect(fraction).toBeGreaterThan(0.03);
    expect(fraction).toBeLessThan(0.07);
  });

  it('only contains 0 or 1', () => {
    const mask = accentMask(500, 0.05, 1);
    for (const v of mask) expect(v === 0 || v === 1).toBe(true);
  });

  it('is deterministic for the same seed', () => {
    expect(accentMask(200, 0.05, 9)).toEqual(accentMask(200, 0.05, 9));
  });
});

describe('screenToNdc', () => {
  it('maps the center to the origin', () => {
    const r = screenToNdc(500, 400, 1000, 800);
    expect(r.x).toBeCloseTo(0, 10);
    expect(r.y).toBeCloseTo(0, 10);
  });

  it('maps corners with y flipped (WebGL up-positive)', () => {
    // Top-left of screen -> NDC (-1, 1)
    expect(screenToNdc(0, 0, 1000, 800)).toEqual({ x: -1, y: 1 });
    // Bottom-right of screen -> NDC (1, -1)
    expect(screenToNdc(1000, 800, 1000, 800)).toEqual({ x: 1, y: -1 });
  });

  it('does not divide by zero for zero-sized viewport', () => {
    const r = screenToNdc(0, 0, 0, 0);
    expect(Number.isNaN(r.x)).toBe(false);
    expect(Number.isNaN(r.y)).toBe(false);
  });
});
