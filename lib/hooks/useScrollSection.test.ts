import { describe, it, expect, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useScrollSection } from './useScrollSection';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('useScrollSection', () => {
  it('defaults to the first section id', () => {
    const { result } = renderHook(() =>
      useScrollSection({ sectionIds: ['hero', 'work'] }),
    );
    expect(result.current.activeId).toBe('hero');
  });

  it('resolves an active id when sections exist in the DOM', () => {
    // jsdom getBoundingClientRect returns zeros, so all tops (0) are <= the
    // trigger line; the reducer returns the last such section.
    for (const id of ['hero', 'work', 'projects']) {
      const el = document.createElement('section');
      el.id = id;
      document.body.appendChild(el);
    }
    const { result } = renderHook(() =>
      useScrollSection({ sectionIds: ['hero', 'work', 'projects'] }),
    );
    expect(['hero', 'work', 'projects']).toContain(result.current.activeId);
  });
});
