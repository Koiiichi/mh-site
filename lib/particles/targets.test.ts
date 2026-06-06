import { describe, it, expect } from 'vitest';
import { proceduralTarget, type ProceduralShape } from './targets';

const shapes: ProceduralShape[] = ['torus', 'box', 'lattice', 'helix'];

describe('proceduralTarget', () => {
  for (const shape of shapes) {
    it(`${shape}: returns count*3 floats normalized within the unit sphere`, () => {
      const count = 1000;
      const buf = proceduralTarget(shape, count, 7);
      expect(buf).toBeInstanceOf(Float32Array);
      expect(buf.length).toBe(count * 3);

      let maxR = 0;
      for (let i = 0; i < count; i++) {
        const x = buf[i * 3];
        const y = buf[i * 3 + 1];
        const z = buf[i * 3 + 2];
        expect(Number.isNaN(x)).toBe(false);
        maxR = Math.max(maxR, Math.sqrt(x * x + y * y + z * z));
      }
      // Normalized: farthest point sits on (or just inside) the unit radius.
      expect(maxR).toBeLessThanOrEqual(1 + 1e-4);
      expect(maxR).toBeGreaterThan(0.5);
    });
  }

  it('is deterministic for the same seed', () => {
    expect(proceduralTarget('torus', 300, 42)).toEqual(
      proceduralTarget('torus', 300, 42),
    );
  });
});
