'use client';

import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import projectsData from '@/data/projects.json';
import { Project } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Slide } from './slide';
import { useCarousel } from './useCarousel';

export function ProjectsCarousel() {
  const projects = useMemo<Project[]>(() => projectsData as unknown as Project[], []);
  const { sectionRef, activeIndex, setActiveIndex, goTo, isManualScroll } = useCarousel(projects.map((p) => p.slug));
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const safeIndex = Math.max(0, Math.min(activeIndex, projects.length - 1));
  const progress = projects.length > 1 ? safeIndex / (projects.length - 1) : 0;
  const activeProject = projects[safeIndex];

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (value) => {
      if (isManualScroll.current) return;
      const next = Math.round(value * (projects.length - 1));
      setActiveIndex((previous) => {
        if (previous === next) return previous;
        return next;
      });
    });
    return () => unsubscribe();
  }, [isManualScroll, projects.length, scrollYProgress, setActiveIndex]);

  return (
    <section id="projects" className="relative">
      <div
        ref={sectionRef}
        className="relative"
        style={{ height: `calc(${projects.length * 0.8} * 100vh + 100vh)` }}
      >
        <div className="sticky top-16 flex min-h-[80vh] flex-col justify-center gap-6 pb-16">
          <header className="flex items-center justify-between gap-6 px-2">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Selected work</p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Scroll through the timeline</h2>
            </div>
            <div className="flex items-center gap-3">
              {projects.map((project, index) => (
                <button
                  key={project.slug}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`View ${project.title}`}
                  aria-pressed={index === safeIndex}
                  className={cn(
                    'h-2 w-8 rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-1 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    index === safeIndex ? 'bg-accent-1' : 'bg-border/50 hover:bg-border'
                  )}
                />
              ))}
            </div>
          </header>
          <div className="mx-2 h-1 rounded-full bg-border/40">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-accent-1 to-accent-2"
              style={{ width: `${Math.min(Math.max(progress, 0), 1) * 100}%` }}
            />
          </div>
          <div className="relative flex-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeProject?.slug}
                className="h-full"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                {activeProject && <Slide project={activeProject} isActive />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
