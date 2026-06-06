'use client';

import { useEffect, useRef, useState } from 'react';
import {
  SECTION_IDS,
  selectActiveSection,
  type SectionRect,
} from './section-state';

export interface UseScrollSectionOptions {
  /** Ordered list of section element ids to observe. */
  sectionIds?: readonly string[];
  /** Fraction of viewport height where the trigger line sits (0..1). */
  triggerRatio?: number;
}

/**
 * Single source of truth for "which section is the user looking at".
 *
 * Reads the live geometry of the section elements (by id) on scroll/resize,
 * rAF-throttled, and resolves a single active section via the pure
 * `selectActiveSection` reducer. The particle morph controller subscribes to
 * the returned id; nav clicks feed the same machine separately (Task 8).
 */
export function useScrollSection(
  options: UseScrollSectionOptions = {},
): { activeId: string } {
  const { sectionIds = SECTION_IDS, triggerRatio = 0.6 } = options;
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? 'hero');
  const frame = useRef<number | null>(null);

  // Stable key so the effect re-subscribes only if the id list truly changes.
  const idsKey = sectionIds.join('|');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ids = idsKey.split('|').filter(Boolean);

    const measure = () => {
      frame.current = null;
      const rects: SectionRect[] = [];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        rects.push({ id, top: r.top, bottom: r.bottom });
      }
      if (rects.length === 0) return;
      const next = selectActiveSection(rects, window.innerHeight, triggerRatio);
      if (next) setActiveId((prev) => (prev === next ? prev : next));
    };

    const onScroll = () => {
      if (frame.current != null) return;
      frame.current = window.requestAnimationFrame(measure);
    };

    // Initial measurement (after layout).
    measure();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame.current != null) cancelAnimationFrame(frame.current);
    };
  }, [idsKey, triggerRatio]);

  return { activeId };
}
