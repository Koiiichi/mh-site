'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import { ThemeToggle } from './theme-toggle';
import { HeroBackground } from './hero-background';
import { useClock } from '@/lib/hooks/useClock';

export function Hero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const prefersReducedMotion = useReducedMotion();
  const translateY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, -60]);
  const { formatted } = useClock();

  return (
    <section ref={containerRef} className="relative mb-24 flex flex-col gap-16">
      <header className="flex items-center justify-between gap-6">
        <div className="flex flex-col">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Currently in</span>
          <span className="font-mono text-sm text-foreground">Waterloo, ON · {formatted}</span>
        </div>
        <ThemeToggle />
      </header>
      <div className="relative overflow-hidden rounded-[2.75rem] border border-subtle bg-surface/80 p-10 sm:p-16">
        <HeroBackground />
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 h-[120%] -translate-y-1/4 bg-[radial-gradient(circle_at_top,_rgba(107,193,255,0.2),_transparent_70%)]"
          style={{ y: translateY }}
        />
        <div className="relative flex flex-col gap-12">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: 'easeOut' }}
            className="max-w-3xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl"
          >
            I am a <em className="font-mono italic">&quot;Software Engineer&quot;</em> with experience building across web, backend, ML, and embedded systems.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: prefersReducedMotion ? 0 : 0.15, duration: prefersReducedMotion ? 0 : 0.6, ease: 'easeOut' }}
            className="max-w-2xl text-lg text-muted sm:text-xl"
          >
            I&apos;ve worked on projects spanning scalable platforms, data pipelines, and real-time firmware — while also exploring new areas like frontend engineering and AI-driven agents.
            Currently a Computational Math & CS student at the University of Waterloo and a Firmware Developer with the Midnight Sun Solar Car Team.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: prefersReducedMotion ? 0 : 0.3, duration: prefersReducedMotion ? 0 : 0.5, ease: 'easeOut' }}
            className="flex flex-wrap items-center gap-4 text-sm"
          >
            <Link
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full border border-subtle bg-surface px-5 py-2.5 font-medium transition hover:border-accent-1 hover:text-accent-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-1 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              View selected work
            </Link>
            <Link
              href="#connect"
              className="inline-flex items-center gap-2 rounded-full border border-transparent bg-[linear-gradient(135deg,var(--acc1),var(--acc2))] px-5 py-2.5 font-medium text-background shadow-md transition hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-1 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              Connect with me
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
