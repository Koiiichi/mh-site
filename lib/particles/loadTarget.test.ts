import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
  sampleGeometry,
  mergeSceneGeometry,
  loadTargetOrPlaceholder,
} from './loadTarget';

describe('sampleGeometry', () => {
  it('samples count*3 floats normalized within the unit sphere', () => {
    const geo = new THREE.BoxGeometry(4, 4, 4); // oversized + centered at origin
    const count = 800;
    const { positions } = sampleGeometry(geo, count);
    expect(positions.length).toBe(count * 3);

    let maxR = 0;
    for (let i = 0; i < count; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];
      expect(Number.isNaN(x)).toBe(false);
      maxR = Math.max(maxR, Math.sqrt(x * x + y * y + z * z));
    }
    expect(maxR).toBeLessThanOrEqual(1 + 1e-4);
    expect(maxR).toBeGreaterThan(0.5);
  });

  it('returns a unit, outward-facing normal per sample', () => {
    const count = 400;
    const { positions, normals } = sampleGeometry(new THREE.BoxGeometry(2, 2, 2), count);
    expect(normals.length).toBe(count * 3);
    for (let i = 0; i < count; i++) {
      const n = [normals[i * 3], normals[i * 3 + 1], normals[i * 3 + 2]];
      expect(Math.hypot(n[0], n[1], n[2])).toBeCloseTo(1, 4);
      // Box faces: the normal is axis-aligned and points the same way as the point.
      const axis = n.findIndex((v) => Math.abs(v) > 0.99);
      expect(axis).toBeGreaterThanOrEqual(0);
      expect(Math.sign(positions[i * 3 + axis])).toBe(Math.sign(n[axis]));
    }
  });

  it('flips normals from inverted-winding geometry to face outward', () => {
    const geo = new THREE.SphereGeometry(1, 16, 12);
    const normal = geo.getAttribute('normal') as THREE.BufferAttribute;
    for (let i = 0; i < normal.array.length; i++) normal.array[i] *= -1;
    const { positions, normals } = sampleGeometry(geo, 300);
    let outward = 0;
    for (let i = 0; i < 300; i++) {
      const d =
        positions[i * 3] * normals[i * 3] +
        positions[i * 3 + 1] * normals[i * 3 + 1] +
        positions[i * 3 + 2] * normals[i * 3 + 2];
      if (d > 0) outward++;
    }
    expect(outward).toBe(300);
  });
});

describe('mergeSceneGeometry', () => {
  it('merges multiple meshes into one position geometry', () => {
    const scene = new THREE.Group();
    const a = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
    a.position.set(-2, 0, 0);
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8));
    b.position.set(2, 0, 0);
    scene.add(a, b);

    const merged = mergeSceneGeometry(scene);
    expect(merged).not.toBeNull();
    expect(merged!.getAttribute('position')).toBeTruthy();
    expect(merged!.getAttribute('position').count).toBeGreaterThan(0);
    expect(merged!.getAttribute('normal').count).toBe(
      merged!.getAttribute('position').count,
    );
  });

  it('computes normals for meshes that ship without them', () => {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    geo.deleteAttribute('normal');
    const scene = new THREE.Group();
    scene.add(new THREE.Mesh(geo), new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1)));
    const merged = mergeSceneGeometry(scene);
    expect(merged!.getAttribute('normal')).toBeTruthy();
  });

  it('returns null for a scene with no meshes', () => {
    const scene = new THREE.Group();
    scene.add(new THREE.Object3D());
    expect(mergeSceneGeometry(scene)).toBeNull();
  });
});

describe('loadTargetOrPlaceholder', () => {
  it('returns the loaded target when the loader succeeds', async () => {
    const fake = {
      positions: new Float32Array(300 * 3).fill(0.5),
      normals: new Float32Array(300 * 3).fill(0.5),
    };
    const target = await loadTargetOrPlaceholder('x.glb', 300, 'torus', 1, async () => fake);
    expect(target).toBe(fake);
  });

  it('falls back to a procedural placeholder when the loader fails', async () => {
    const { positions, normals } = await loadTargetOrPlaceholder(
      'missing.glb',
      300,
      'torus',
      1,
      async () => {
        throw new Error('404');
      },
    );
    expect(positions.length).toBe(300 * 3);
    expect(normals.length).toBe(300 * 3);
    // Placeholder is normalized within the unit sphere.
    let maxR = 0;
    for (let i = 0; i < 300; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];
      maxR = Math.max(maxR, Math.sqrt(x * x + y * y + z * z));
    }
    expect(maxR).toBeLessThanOrEqual(1 + 1e-4);
  });
});
