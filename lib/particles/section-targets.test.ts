import { describe, it, expect } from 'vitest';
import {
  targetConfigFor,
  morphingSectionIds,
  modelUrl,
  SECTION_TARGETS,
  SPECIAL_TARGETS,
} from './section-targets';

describe('section-targets', () => {
  it('hero maps to the living bonsai model', () => {
    expect(targetConfigFor('hero').model).toBe('morph-hero.glb');
  });

  it('work maps to the briefcase model', () => {
    expect(targetConfigFor('work').model).toBe('morph-work.glb');
  });

  it('projects/now/connect/footer map to their models', () => {
    expect(targetConfigFor('projects').model).toBe('morph-projects.glb');
    expect(targetConfigFor('now').model).toBe('morph-now.glb');
    expect(targetConfigFor('connect').model).toBe('morph-connect.glb');
    expect(targetConfigFor('footer').model).toBe('morph-footer.glb');
  });

  it('special states cover idle rest and legacy portal', () => {
    expect(SPECIAL_TARGETS.idle).toBe('morph-hero.glb');
    expect(SPECIAL_TARGETS.legacy).toBe('morph-legacy.glb');
  });

  it('unknown sections fall back to the sphere', () => {
    expect(targetConfigFor('does-not-exist').model).toBeNull();
  });

  it('morphingSectionIds includes hero and footer', () => {
    const ids = morphingSectionIds();
    expect(ids).toContain('hero');
    expect(ids).toContain('footer');
  });
});

describe('modelUrl', () => {
  it('prefixes the default /models base', () => {
    expect(modelUrl('morph-hero.glb')).toBe('/models/morph-hero.glb');
  });

  it('uses SECTION_TARGETS filenames that resolve under the base', () => {
    for (const id of Object.keys(SECTION_TARGETS)) {
      const m = SECTION_TARGETS[id].model;
      if (m) expect(modelUrl(m)).toMatch(/\/models\/morph-.*\.glb$/);
    }
  });
});
