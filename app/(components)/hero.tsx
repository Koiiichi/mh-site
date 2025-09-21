'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import { ThemeToggle } from './theme-toggle';
import { HeroBackground } from './hero-background';
import { ChevronDown } from 'lucide-react';

export function Hero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const prefersReducedMotion = useReducedMotion();
  const translateY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, -60]);

  return (
    <section ref={containerRef} className="relative mb-8 flex flex-col gap-16">
      <header className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <span className="text-lg font-medium text-foreground">Muneeb Hassan</span>
          <nav className="hidden sm:flex items-center gap-6">
            <Link 
              href="#projects" 
              className="text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              Projects
            </Link>
            <Link 
              href="#connect" 
              className="text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              Contact Me
            </Link>
          </nav>
        </div>
        <ThemeToggle />
      </header>
      <div className="relative overflow-hidden rounded-[2.75rem] border border-subtle bg-surface/80 p-8 sm:p-12">
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
            className="max-w-3xl text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl"
          >
            I am a <em className="font-newsreader italic">Software Engineer</em> with experience building across web, backend, ML, and embedded systems.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: prefersReducedMotion ? 0 : 0.15, duration: prefersReducedMotion ? 0 : 0.6, ease: 'easeOut' }}
            className="max-w-3xl text-base text-muted sm:text-lg"
          >
            I&apos;ve worked on projects spanning scalable platforms, data pipelines, and real-time firmware — while also exploring new areas like frontend engineering and AI-driven agents. Currently a Computational Math & CS student at the University of Waterloo and a Firmware Developer with the Midnight Sun Solar Car Team.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: prefersReducedMotion ? 0 : 0.3, duration: prefersReducedMotion ? 0 : 0.5, ease: 'easeOut' }}
            className="flex justify-center pt-8"
          >
            <Link
              href="#projects"
              className="group inline-flex flex-col items-center gap-2 text-muted hover:text-accent-1 transition-colors"
              aria-label="Scroll to projects section"
              data-no-cursor-outline
            >
              <span className="text-sm font-medium">View Projects</span>
              <motion.div
                animate={{
                  y: prefersReducedMotion ? 0 : [0, 8, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'loop',
                  ease: 'easeInOut',
                }}
              >
                <ChevronDown className="h-6 w-6" />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
