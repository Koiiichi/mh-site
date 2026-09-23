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

describe('useScrollSection re-measuring', () => {
  function section(id: string, top: number, bottom: number) {
    const el = document.createElement('section');
    el.id = id;
    el.getBoundingClientRect = () => ({ top, bottom }) as DOMRect;
    document.body.appendChild(el);
    return el;
  }

  it('re-measures when the remeasure key changes', () => {
    // Stands in for a route change: the section that was active when the user
    // left the page must not survive their return, scroll event or not.
    section('hero', -900, -100);
    section('work', 120, 1400);

    const { result, rerender } = renderHook(
      ({ path }: { path: string }) =>
        useScrollSection({ sectionIds: ['hero', 'work'], remeasureKey: path }),
      { initialProps: { path: '/' } },
    );
    expect(result.current.activeId).toBe('work');

    // Back at the top of the page, as after a navigation with scroll reset.
    document.body.innerHTML = '';
    section('hero', 0, 800);
    section('work', 900, 2000);

    rerender({ path: '/design-philosophy' });
    expect(result.current.activeId).toBe('hero');
  });
});
