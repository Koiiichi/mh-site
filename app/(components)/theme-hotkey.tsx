'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;
      if (event.key.toLowerCase() === 't') {
        const current = resolvedTheme ?? 'dark';
        setTheme(current === 'dark' ? 'light' : 'dark');
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [resolvedTheme, setTheme]);

  return null;
}
