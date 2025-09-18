'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useMemo, useRef } from 'react';
import { ThemeToggle } from './theme-toggle';
import { useClock } from '@/lib/hooks/useClock';

export function Hero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const prefersReducedMotion = useReducedMotion();
  const translateY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, -60]);
  const { formatted } = useClock();
  const noiseTexture = useMemo(
    () =>
      "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 opacity=%220.35%22/%3E%3C/svg%3E')",
    []
  );

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
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ y: translateY }}
        >
          <motion.div
            className="absolute -inset-[35%] rounded-[36%] bg-[conic-gradient(from_120deg,_rgba(107,193,255,0.65),rgba(20,26,34,0.05)_45%,rgba(138,255,224,0.6),rgba(20,26,34,0.08)_85%)] blur-[120px] opacity-70"
            animate={prefersReducedMotion ? undefined : { rotate: 360 }}
            transition={prefersReducedMotion ? undefined : { duration: 48, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute left-1/2 top-[-10%] h-[60%] w-[60%] -translate-x-1/2 rounded-[40%] bg-[radial-gradient(circle_at_30%_20%,rgba(138,255,224,0.35),transparent_65%)] blur-3xl"
            animate={prefersReducedMotion ? undefined : { x: ['-10%', '12%', '-6%'], y: ['-12%', '18%', '0%'] }}
            transition={prefersReducedMotion ? undefined : { duration: 26, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(94,169,255,0.2),transparent_55%)]"
            animate={prefersReducedMotion ? undefined : { opacity: [0.55, 0.35, 0.6] }}
            transition={prefersReducedMotion ? undefined : { duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute inset-0 opacity-40 mix-blend-soft-light" style={{ backgroundImage: noiseTexture }} />
        </motion.div>
        <div className="relative flex flex-col gap-12">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: 'easeOut' }}
            className="max-w-3xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl"
          >
            Designing reliable firmware and collaborative dev tools for ambitious teams.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: prefersReducedMotion ? 0 : 0.15, duration: prefersReducedMotion ? 0 : 0.6, ease: 'easeOut' }}
            className="max-w-2xl text-lg text-muted sm:text-xl"
          >
            I’m Muneeb Hassan — a Computational Mathematics student and design-minded engineer. I help teams ship
            dependable embedded systems, multiplayer editors, and data tooling that stay elegant at scale. Most days I’m
            balancing real-time firmware at Midnight Sun, advancing CoCode’s collaboration layer, and mentoring peers in
            approachable developer experience.
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
          <motion.ul
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: prefersReducedMotion ? 0 : 0.45, duration: prefersReducedMotion ? 0 : 0.5, ease: 'easeOut' }}
            className="grid gap-3 text-sm text-muted sm:grid-cols-2"
          >
            <li className="rounded-2xl border border-subtle/60 bg-surface/70 p-4">
              Firmware Developer · Midnight Sun Solar Car — integrating FreeRTOS-safe controls and telemetry.
            </li>
            <li className="rounded-2xl border border-subtle/60 bg-surface/70 p-4">
              Builder of CoCode — a Firebase-powered collaborative editor demoed with the UW CS community.
            </li>
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
