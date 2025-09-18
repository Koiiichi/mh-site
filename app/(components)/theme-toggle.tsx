'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';

const iconVariants = {
  enter: { opacity: 0, scale: 0.75, rotate: -12 },
  center: { opacity: 1, scale: 1, rotate: 0 },
  exit: { opacity: 0, scale: 0.75, rotate: 12 }
};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  const Icon = useMemo(() => (resolvedTheme === 'dark' ? Sun : Moon), [resolvedTheme]);

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-subtle bg-transparent text-foreground transition hover:border-accent-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-1 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label="Toggle theme"
    >
      <motion.div
        key={resolvedTheme}
        variants={prefersReducedMotion ? undefined : iconVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: 'easeOut' }}
        className="flex h-full w-full items-center justify-center"
      >
        <Icon className="h-4 w-4" />
      </motion.div>
    </button>
  );
}
