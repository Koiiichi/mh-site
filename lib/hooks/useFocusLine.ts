'use client';

import { useEffect, useRef } from 'react';

export interface FocusLineOptions {
  /** Viewport fraction where the focus line sits (matches the orb's cy ≈ 0.5). */
  line?: number;
  /** Opacity for the item sitting on the focus line. */
  maxOpacity?: number;
  /** Opacity for items farthest from the line. */
  minOpacity?: number;
  /** Distance (px) from the line beyond which an item is fully dimmed. */
  falloff?: number;
}

/**
 * The orb is the page's "playhead". This hook dims a container's
 * `[data-focus-item]` descendants by their distance from the orb's vertical
 * line, so whatever aligns with the orb reads as in-focus and the rest recedes
 * — content animates *through* the orb's attention as you scroll.
 *
 * Opacity-only (no transform) so it never fights Framer Motion. Disabled under
 * reduced motion and on small screens (single-column, no orb line).
 */
export function useFocusLine<T extends HTMLElement>(
  options: FocusLineOptions = {},
) {
  const ref = useRef<T | null>(null);
  const { line = 0.5, maxOpacity = 1, minOpacity = 0.32, falloff = 300 } = options;

  useEffect(() => {
    const el = ref.current;
    if (typeof window === 'undefined' || !el) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const enabled = () =>
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(min-width: 768px)').matches;
    const items = () =>
      Array.from(el.querySelectorAll<HTMLElement>('[data-focus-item]'));

    let frame: number | null = null;
    const update = () => {
      frame = null;
      const list = items();
      if (!enabled()) {
        for (const it of list) it.style.opacity = '';
        return;
      }
      const lineY = window.innerHeight * line;
      for (const it of list) {
        const r = it.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const d = Math.min(Math.abs(center - lineY) / falloff, 1);
        it.style.opacity = `${maxOpacity - (maxOpacity - minOpacity) * d}`;
        it.style.transition = 'opacity 0.25s ease-out';
      }
    };
    const onScroll = () => {
      if (frame == null) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame != null) cancelAnimationFrame(frame);
    };
  }, [line, maxOpacity, minOpacity, falloff]);

  return ref;
}
