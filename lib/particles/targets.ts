/**
 * Procedural point-cloud shape generators.
 *
 * These produce Float32Array(count*3) buffers normalized to the unit sphere,
 * suitable as morph targets. They serve two purposes:
 *   - demo/development targets for the morph engine (Task 6), and
 *   - placeholders that stand in for real .glb models until those assets land
 *     (Task 7/8), so the section morph map is never blocked.
 */

import { mulberry32, normalizeToUnitSphere } from './math';

export type ProceduralShape = 'torus' | 'box' | 'lattice' | 'helix';

const TWO_PI = Math.PI * 2;

function torus(count: number, rng: () => number): Float32Array {
  const out = new Float32Array(count * 3);
  const R = 0.7; // ring radius
  const r = 0.3; // tube radius
  for (let i = 0; i < count; i++) {
    const u = rng() * TWO_PI;
    const v = rng() * TWO_PI;
    out[i * 3] = (R + r * Math.cos(v)) * Math.cos(u);
    out[i * 3 + 1] = r * Math.sin(v);
    out[i * 3 + 2] = (R + r * Math.cos(v)) * Math.sin(u);
  }
  return out;
}

function box(count: number, rng: () => number): Float32Array {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Pick a face, then a random point on it (hollow box → reads as a shape).
    const face = Math.floor(rng() * 6);
    const a = rng() * 2 - 1;
    const b = rng() * 2 - 1;
    let x = 0;
    let y = 0;
    let z = 0;
    switch (face) {
      case 0: x = 1; y = a; z = b; break;
      case 1: x = -1; y = a; z = b; break;
      case 2: x = a; y = 1; z = b; break;
      case 3: x = a; y = -1; z = b; break;
      case 4: x = a; y = b; z = 1; break;
      default: x = a; y = b; z = -1; break;
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

function lattice(count: number, rng: () => number): Float32Array {
  // A jittered 3D grid — "structured / orbital system" feel.
  const out = new Float32Array(count * 3);
  const side = Math.max(2, Math.round(Math.cbrt(count)));
  for (let i = 0; i < count; i++) {
    const gx = i % side;
    const gy = Math.floor(i / side) % side;
    const gz = Math.floor(i / (side * side)) % side;
    const j = 0.06;
    out[i * 3] = (gx / (side - 1)) * 2 - 1 + (rng() - 0.5) * j;
    out[i * 3 + 1] = (gy / (side - 1)) * 2 - 1 + (rng() - 0.5) * j;
    out[i * 3 + 2] = (gz / (side - 1)) * 2 - 1 + (rng() - 0.5) * j;
  }
  return out;
}

function helix(count: number, rng: () => number): Float32Array {
  // Double helix ribbon.
  const out = new Float32Array(count * 3);
  const turns = 3;
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const strand = i % 2 === 0 ? 0 : Math.PI;
    const angle = t * TWO_PI * turns + strand;
    const rad = 0.35;
    out[i * 3] = Math.cos(angle) * rad + (rng() - 0.5) * 0.03;
    out[i * 3 + 1] = t * 2 - 1;
    out[i * 3 + 2] = Math.sin(angle) * rad + (rng() - 0.5) * 0.03;
  }
  return out;
}

const GENERATORS: Record<
  ProceduralShape,
  (count: number, rng: () => number) => Float32Array
> = { torus, box, lattice, helix };

/**
 * Generate a normalized procedural morph target of `count` points.
 */
export function proceduralTarget(
  shape: ProceduralShape,
  count: number,
  seed = 1,
): Float32Array {
  const rng = mulberry32(seed);
  const raw = GENERATORS[shape](count, rng);
  return normalizeToUnitSphere(raw, 1);
}
