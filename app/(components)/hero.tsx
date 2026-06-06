'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ThemeToggle } from './theme-toggle';

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const handleScrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="hero" className="relative mb-8 flex flex-col gap-12">
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

      {/* Availability chip — demoted out of the headline column. */}
      <div>
        <span className="inline-block rounded-sm border border-current px-2 py-0.5 font-mono text-xs tracking-wide text-muted opacity-60">
          available — summer &rsquo;26
        </span>
      </div>

      <div className="flex flex-col gap-8 pt-2">
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: 'easeOut' }}
          className="max-w-3xl text-balance font-mincho text-3xl font-normal leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl"
        >
          Build what <em className="font-newsreader italic">outlasts.</em>
        </motion.h1>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: prefersReducedMotion ? 0 : 0.15,
            duration: prefersReducedMotion ? 0 : 0.6,
            ease: 'easeOut',
          }}
          className="max-w-3xl"
        >
          <p className="text-base text-muted sm:text-lg">
            Thinking about evaluation, inference infrastructure, and production ML.
            <br />
            CS + Stats @ UWaterloo.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
