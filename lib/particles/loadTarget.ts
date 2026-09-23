/**
 * Asset pipeline: turn a .glb model into a normalized particle morph target.
 *
 * Flow: GLTFLoader -> merge all mesh geometry (baked to world space) ->
 * MeshSurfaceSampler samples `count` evenly-distributed surface points (with
 * interpolated normals) -> normalizeToUnitSphere so any Sketchfab scale/units
 * become consistent.
 *
 * If a model is missing or fails to load, callers fall back to a procedural
 * placeholder so the section morph map is never blocked on assets.
 *
 * Asset contract — see public/models/README.md.
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { normalizeToUnitSphere, orientNormalsOutward } from './math';
import {
  proceduralMorphTarget,
  type MorphTarget,
  type ProceduralShape,
} from './targets';

// Shared Draco decoder (models are Draco-compressed). Decoder wasm/js is
// loaded on demand from the pinned gstatic CDN.
let dracoLoader: DRACOLoader | null = null;
function getDracoLoader(): DRACOLoader {
  if (!dracoLoader) {
    dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(
      'https://www.gstatic.com/draco/versioned/decoders/1.5.7/',
    );
  }
  return dracoLoader;
}

/**
 * Merge every mesh under `root` into one position + normal BufferGeometry,
 * baked into world space. Meshes without normals get smooth computed ones.
 * Returns null if there are no meshes.
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
    // Compute while still indexed so shared vertices average into smooth normals.
    if (!cloned.getAttribute('normal')) cloned.computeVertexNormals();
    // Transforms normals too (via the normal matrix).
    cloned.applyMatrix4(mesh.matrixWorld);
    // Normalize to non-indexed, position + normal only so all parts merge cleanly.
    const nonIndexed = cloned.index ? cloned.toNonIndexed() : cloned;
    const position = nonIndexed.getAttribute('position');
    const normal = nonIndexed.getAttribute('normal');
    if (position && normal) {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', (position as THREE.BufferAttribute).clone());
      g.setAttribute('normal', (normal as THREE.BufferAttribute).clone());
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
 * Sample `count` points from a geometry's surface (area-weighted) with their
 * interpolated normals, normalized to the unit sphere and oriented outward.
 * Pure (no WebGL) — runs in tests.
 */
export function sampleGeometry(
  geometry: THREE.BufferGeometry,
  count: number,
): MorphTarget {
  if (!geometry.getAttribute('normal')) geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry);
  const sampler = new MeshSurfaceSampler(mesh).build();
  const raw = new Float32Array(count * 3);
  const normals = new Float32Array(count * 3);
  const p = new THREE.Vector3();
  const n = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    sampler.sample(p, n);
    raw[i * 3] = p.x;
    raw[i * 3 + 1] = p.y;
    raw[i * 3 + 2] = p.z;
    normals[i * 3] = n.x;
    normals[i * 3 + 1] = n.y;
    normals[i * 3 + 2] = n.z;
  }
  const positions = normalizeToUnitSphere(raw, 1);
  return { positions, normals: orientNormalsOutward(positions, normals) };
}

/** Load a .glb and sample it into a normalized morph target. */
export function loadGLB(url: string, count: number): Promise<MorphTarget> {
  return new Promise<MorphTarget>((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.setDRACOLoader(getDracoLoader());
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

export type GLBLoader = (url: string, count: number) => Promise<MorphTarget>;

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
): Promise<MorphTarget> {
  try {
    return await loadFn(url, count);
  } catch {
    return proceduralMorphTarget(fallback, count, seed);
  }
}
