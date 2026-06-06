import { describe, it, expect } from 'vitest';
import * as THREE from 'three';

describe('test harness', () => {
  it('runs a trivial assertion', () => {
    expect(1 + 1).toBe(2);
  });

  it('resolves the three.js import', () => {
    expect(typeof THREE.Vector3).toBe('function');
    const v = new THREE.Vector3(1, 2, 3);
    expect(v.length()).toBeCloseTo(Math.sqrt(14));
  });
});
