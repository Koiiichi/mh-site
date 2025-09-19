'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export function useCarousel(slugs: string[]) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isManualScroll = useRef(false);
  const slugsMemo = useMemo(() => slugs, [slugs]);

  const goTo = useCallback(
    (index: number, behavior: ScrollBehavior = 'smooth') => {
      if (!sectionRef.current || typeof window === 'undefined') return;
      const clamped = Math.max(0, Math.min(index, slugsMemo.length - 1));
      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      // Account for the reduced height calculation (0.8 factor)
      const totalHeight = section.offsetHeight - window.innerHeight;
      const progress = slugsMemo.length > 1 ? clamped / (slugsMemo.length - 1) : 0;
      // Limit the scroll to 80% of the total height to allow natural release
      const target = rect.top + window.scrollY + (totalHeight * 0.8) * progress;
      isManualScroll.current = true;
      window.scrollTo({ top: target, behavior });
      window.setTimeout(() => {
        isManualScroll.current = false;
      }, 400);
    },
    [slugsMemo]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const initialSlug = window.location.hash.replace('#', '');
    const index = slugsMemo.indexOf(initialSlug);
    if (index >= 0) {
      setActiveIndex(index);
      requestAnimationFrame(() => goTo(index));
    }
  }, [goTo, slugsMemo]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => {
      const slug = window.location.hash.replace('#', '');
      const index = slugsMemo.indexOf(slug);
      if (index >= 0) {
        setActiveIndex(index);
      }
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, [slugsMemo]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const slug = slugsMemo[activeIndex];
    if (!slug) return;
    if (window.location.hash.replace('#', '') !== slug) {
      history.replaceState(null, '', `#${slug}`);
    }
  }, [activeIndex, slugsMemo]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleKey = (event: KeyboardEvent) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;
      event.preventDefault();
      const delta = event.key === 'ArrowRight' ? 1 : -1;
      const next = Math.max(0, Math.min(activeIndex + delta, slugsMemo.length - 1));
      if (next !== activeIndex) {
        goTo(next);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIndex, goTo, slugsMemo.length]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let startX = 0;
    let currentX = 0;
    const onTouchStart = (event: TouchEvent) => {
      if (!sectionRef.current) return;
      if (!sectionRef.current.contains(event.target as Node)) return;
      startX = event.touches[0].clientX;
      currentX = startX;
    };
    const onTouchMove = (event: TouchEvent) => {
      currentX = event.touches[0].clientX;
    };
    const onTouchEnd = () => {
      const delta = currentX - startX;
      if (Math.abs(delta) < 60) return;
      const direction = delta < 0 ? 1 : -1;
      const next = Math.max(0, Math.min(activeIndex + direction, slugsMemo.length - 1));
      if (next !== activeIndex) {
        goTo(next);
      }
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [activeIndex, goTo, slugsMemo.length]);

  return {
    sectionRef,
    activeIndex,
    setActiveIndex,
    goTo,
    isManualScroll
  } as const;
}
