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
    const buf = sampleGeometry(geo, count);
    expect(buf.length).toBe(count * 3);

    let maxR = 0;
    for (let i = 0; i < count; i++) {
      const x = buf[i * 3];
      const y = buf[i * 3 + 1];
      const z = buf[i * 3 + 2];
      expect(Number.isNaN(x)).toBe(false);
      maxR = Math.max(maxR, Math.sqrt(x * x + y * y + z * z));
    }
    expect(maxR).toBeLessThanOrEqual(1 + 1e-4);
    expect(maxR).toBeGreaterThan(0.5);
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
  });

  it('returns null for a scene with no meshes', () => {
    const scene = new THREE.Group();
    scene.add(new THREE.Object3D());
    expect(mergeSceneGeometry(scene)).toBeNull();
  });
});

describe('loadTargetOrPlaceholder', () => {
  it('returns the loaded buffer when the loader succeeds', async () => {
    const fake = new Float32Array(300 * 3).fill(0.5);
    const buf = await loadTargetOrPlaceholder('x.glb', 300, 'torus', 1, async () => fake);
    expect(buf).toBe(fake);
  });

  it('falls back to a procedural placeholder when the loader fails', async () => {
    const buf = await loadTargetOrPlaceholder(
      'missing.glb',
      300,
      'torus',
      1,
      async () => {
        throw new Error('404');
      },
    );
    expect(buf.length).toBe(300 * 3);
    // Placeholder is normalized within the unit sphere.
    let maxR = 0;
    for (let i = 0; i < 300; i++) {
      const x = buf[i * 3];
      const y = buf[i * 3 + 1];
      const z = buf[i * 3 + 2];
      maxR = Math.max(maxR, Math.sqrt(x * x + y * y + z * z));
    }
    expect(maxR).toBeLessThanOrEqual(1 + 1e-4);
  });
});
