import { describe, it, expect } from 'vitest';
import {
  targetConfigFor,
  morphingSectionIds,
  SECTION_TARGETS,
} from './section-targets';

describe('section-targets', () => {
  it('hero is the resting sphere (no model)', () => {
    expect(targetConfigFor('hero').model).toBeNull();
  });

  it('non-hero sections have a model path and a placeholder shape', () => {
    for (const id of ['work', 'projects', 'now', 'connect']) {
      const cfg = targetConfigFor(id);
      expect(cfg.model).toMatch(/\.glb$/);
      expect(cfg.fallback).toBeTruthy();
    }
  });

  it('unknown sections fall back to the hero/sphere config', () => {
    expect(targetConfigFor('does-not-exist')).toEqual(SECTION_TARGETS.hero);
  });

  it('morphingSectionIds excludes hero', () => {
    const ids = morphingSectionIds();
    expect(ids).not.toContain('hero');
    expect(ids).toEqual(['work', 'projects', 'now', 'connect']);
  });
});
