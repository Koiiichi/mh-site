import { describe, it, expect } from 'vitest';
import { LORE_SETTLE, loreStepIndexAt, loreSettleDurationMs } from './lore';

describe('LORE_SETTLE', () => {
  it('opens on the sphere and ends resting on the living bonsai', () => {
    expect(LORE_SETTLE[0].id).toBeNull();
    const last = LORE_SETTLE[LORE_SETTLE.length - 1];
    expect(last.id).toBe('hero');
    expect(last.holdMs).toBe(Infinity);
  });

  it('holds each shape longer than the one before ("each return is nearer")', () => {
    for (let i = 1; i < LORE_SETTLE.length; i++) {
      expect(LORE_SETTLE[i].holdMs).toBeGreaterThan(LORE_SETTLE[i - 1].holdMs);
    }
  });
});

describe('loreStepIndexAt', () => {
  const steps = [
    { id: null, holdMs: 1000 },
    { id: 'a', holdMs: 2000 },
    { id: 'b', holdMs: Infinity },
  ];

  it('walks the schedule by elapsed time', () => {
    expect(loreStepIndexAt(0, steps)).toBe(0);
    expect(loreStepIndexAt(999, steps)).toBe(0);
    expect(loreStepIndexAt(1000, steps)).toBe(1);
    expect(loreStepIndexAt(2999, steps)).toBe(1);
    expect(loreStepIndexAt(3000, steps)).toBe(2);
  });

  it('rests on the last step forever', () => {
    expect(loreStepIndexAt(10_000_000, steps)).toBe(2);
  });

  it('treats negative time as the start', () => {
    expect(loreStepIndexAt(-50, steps)).toBe(0);
  });
});

describe('loreSettleDurationMs', () => {
  it('measures the time up to the resting shape', () => {
    expect(loreSettleDurationMs([
      { id: null, holdMs: 1000 },
      { id: 'a', holdMs: 2000 },
      { id: 'b', holdMs: Infinity },
    ])).toBe(3000);
  });
});
