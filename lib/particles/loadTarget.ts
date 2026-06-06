/**
 * Asset pipeline: turn a .glb model into a normalized particle morph target.
 *
 * Flow: GLTFLoader -> merge all mesh geometry (baked to world space) ->
 * MeshSurfaceSampler samples `count` evenly-distributed surface points ->
 * normalizeToUnitSphere so any Sketchfab scale/units become consistent.
 *
 * If a model is missing or fails to load, callers fall back to a procedural
 * placeholder so the section morph map is never blocked on assets.
 *
 * Asset contract — see public/models/README.md.
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { normalizeToUnitSphere } from './math';
import { proceduralTarget, type ProceduralShape } from './targets';

/**
 * Merge every mesh under `root` into one position-only BufferGeometry, baked
 * into world space. Returns null if there are no meshes.
 */
export function mergeSceneGeometry(
  root: THREE.Object3D,
): THREE.BufferGeometry | null {
  const geometries: THREE.BufferGeometry[] = [];
  root.updateMatrixWorld(true);

  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh || !mesh.geometry) return;

    const cloned = mesh.geometry.clone();
    cloned.applyMatrix4(mesh.matrixWorld);
    // Normalize to non-indexed, position-only so all parts merge cleanly.
    const nonIndexed = cloned.index ? cloned.toNonIndexed() : cloned;
    const position = nonIndexed.getAttribute('position');
    if (position) {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', (position as THREE.BufferAttribute).clone());
      geometries.push(g);
    }
    cloned.dispose();
    if (nonIndexed !== cloned) nonIndexed.dispose();
  });

  if (geometries.length === 0) return null;
  if (geometries.length === 1) return geometries[0];
  return mergeGeometries(geometries, false);
}

/**
 * Sample `count` points from a geometry's surface (area-weighted) and return a
 * normalized Float32Array(count*3). Pure (no WebGL) — runs in tests.
 */
export function sampleGeometry(
  geometry: THREE.BufferGeometry,
  count: number,
): Float32Array {
  const mesh = new THREE.Mesh(geometry);
  const sampler = new MeshSurfaceSampler(mesh).build();
  const out = new Float32Array(count * 3);
  const p = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    sampler.sample(p);
    out[i * 3] = p.x;
    out[i * 3 + 1] = p.y;
    out[i * 3 + 2] = p.z;
  }
  return normalizeToUnitSphere(out, 1);
}

/** Load a .glb and sample it into a normalized morph target buffer. */
export function loadGLB(url: string, count: number): Promise<Float32Array> {
  return new Promise<Float32Array>((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        try {
          const merged = mergeSceneGeometry(gltf.scene);
          if (!merged) {
            reject(new Error(`No mesh geometry found in ${url}`));
            return;
          }
          resolve(sampleGeometry(merged, count));
        } catch (err) {
          reject(err as Error);
        }
      },
      undefined,
      (err) => reject(err as Error),
    );
  });
}

export type GLBLoader = (url: string, count: number) => Promise<Float32Array>;

/**
 * Load a model target, falling back to a procedural placeholder on any failure
 * (missing file, no mesh, parse error). `loadFn` is injectable for testing.
 */
export async function loadTargetOrPlaceholder(
  url: string,
  count: number,
  fallback: ProceduralShape,
  seed = 1,
  loadFn: GLBLoader = loadGLB,
): Promise<Float32Array> {
  try {
    return await loadFn(url, count);
  } catch {
    return proceduralTarget(fallback, count, seed);
  }
}
