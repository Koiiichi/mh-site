'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ThemeToggle } from './theme-toggle';
import { Kanji } from './kanji';

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const handleScrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="hero" className="relative flex min-h-[92vh] flex-col gap-12">
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

      {/* Headline sits low — below the orb, which occupies the upper-center. */}
      <div className="flex flex-1 flex-col items-center justify-end gap-6 pb-[12vh] text-center">
        {/* Availability chip */}
        <div>
          <span className="inline-block rounded-sm border border-current px-2 py-0.5 font-mono text-xs tracking-wide text-muted opacity-60">
            available — summer &rsquo;26
          </span>
        </div>

        <Kanji char="命" romaji="inochi" meaning="life" className="text-2xl text-muted/30" />

        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: 'easeOut' }}
          className="max-w-3xl text-balance font-newsreader text-4xl font-normal leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl"
        >
          Build what <em className="font-newsreader italic">outlasts.</em>
        </motion.h1>
      </div>
    </section>
  );
}
