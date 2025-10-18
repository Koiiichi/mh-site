'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ThemeToggle } from './theme-toggle';
import { HeroBackground } from './hero-background';
import { ChevronDown } from 'lucide-react';

export function Hero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const prefersReducedMotion = useReducedMotion();
  const translateY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, -60]);

  const handleScrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section ref={containerRef} className="relative mb-8 flex flex-col gap-16">
      <header className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <span className="text-lg font-medium text-foreground">Muneeb Hassan</span>
          <nav className="hidden sm:flex items-center gap-6">
            <button
              onClick={() => handleScrollToSection('#work')}
              className="text-sm font-medium text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              Work
            </button>
            <button
              onClick={() => handleScrollToSection('#projects')}
              className="text-sm font-medium text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              Projects
            </button>
            <button
              onClick={() => handleScrollToSection('#now')}
              className="font-newsreader italic text-sm font-medium text-muted hover:text-foreground transition-colors cursor-pointer inline-flex items-center translate-y-[2.2px]"
            >
              Now
            </button>
            <button
              onClick={() => handleScrollToSection('#connect')}
              className="text-sm font-medium text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              Connect
            </button>
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
        <div className="relative flex flex-col gap-8">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: 'easeOut' }}
            className="max-w-3xl text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl"
          >
           <em className="font-newsreader italic">Building across the stack.</em>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: prefersReducedMotion ? 0 : 0.15, duration: prefersReducedMotion ? 0 : 0.6, ease: 'easeOut' }}
            className="max-w-3xl space-y-4"
          >
            <p className="text-base text-muted sm:text-lg">
              Working on backend systems, data workflows, and occasionally embedded projects. CS + Stats @UWaterloo.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: prefersReducedMotion ? 0 : 0.3, duration: prefersReducedMotion ? 0 : 0.5, ease: 'easeOut' }}
            className="flex justify-center pt-4"
          >
            <button
              onClick={() => handleScrollToSection('#work')}
              className="group inline-flex flex-col items-center gap-2 text-muted hover:text-accent-1 transition-colors bg-transparent border-none cursor-pointer"
              aria-label="Scroll to work section"
            >
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
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
