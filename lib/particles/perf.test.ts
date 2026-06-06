import { describe, it, expect } from 'vitest';
import {
  particleCountForWidth,
  cappedDelta,
  PARTICLE_COUNT_DESKTOP,
  PARTICLE_COUNT_MOBILE,
  MAX_FRAME_DELTA,
} from './perf';

describe('particleCountForWidth', () => {
  it('uses the mobile tier at/below 767px', () => {
    expect(particleCountForWidth(767)).toBe(PARTICLE_COUNT_MOBILE);
    expect(particleCountForWidth(360)).toBe(PARTICLE_COUNT_MOBILE);
  });

  it('uses the desktop tier above 767px', () => {
    expect(particleCountForWidth(768)).toBe(PARTICLE_COUNT_DESKTOP);
    expect(particleCountForWidth(1440)).toBe(PARTICLE_COUNT_DESKTOP);
  });
});

describe('cappedDelta', () => {
  it('passes through small deltas unchanged', () => {
    expect(cappedDelta(0.016)).toBeCloseTo(0.016, 6);
  });

  it('caps large deltas (tab resume) at the max', () => {
    expect(cappedDelta(5)).toBe(MAX_FRAME_DELTA);
  });

  it('returns 0 for negative or non-finite input', () => {
    expect(cappedDelta(-1)).toBe(0);
    expect(cappedDelta(NaN)).toBe(0);
    expect(cappedDelta(Infinity)).toBe(0);
  });
});
