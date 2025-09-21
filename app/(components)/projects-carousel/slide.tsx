'use client';

import { useHoldPreview } from '../hold-preview/hold-preview';
import { useLongPress } from '../hold-preview/useLongPress';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { Project } from '@/lib/types';

const slideVariants = {
  enter: { opacity: 0, x: 120 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -80 }
};

type SlideProps = {
  project: Project;
  isActive: boolean;
};

export function Slide({ project, isActive }: SlideProps) {
  const { openPreview } = useHoldPreview();
  const prefersReducedMotion = useReducedMotion();
  const links = useMemo(() => Object.entries(project.links), [project.links]);

  const longPressHandlers = useLongPress((event) => {
    openPreview(
      {
        title: project.title,
        summary: project.summary,
        media: project.media,
        tags: project.tags,
        metrics: project.metrics,
        links: links.map(([label, href]) => ({ label, href }))
      },
      event.origin
    );
  });

  return (
    <motion.article
      variants={prefersReducedMotion ? undefined : slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: 'easeOut' }}
      className="group grid min-h-[60vh] grid-cols-1 gap-10 rounded-[2.5rem] border border-subtle bg-surface/90 p-10 shadow-[0_42px_120px_rgba(5,8,12,0.25)] backdrop-blur md:grid-cols-[1.05fr_0.95fr]"
      {...longPressHandlers}
      tabIndex={0}
      role="group"
    >
      <div className="flex flex-col justify-between gap-8">
        <div className="space-y-6">
          {(project.timeframe || project.role) && (
            <div className="flex items-center gap-3 text-sm text-muted">
              {project.timeframe && (
                <span className="font-mono uppercase tracking-[0.2em]">{project.timeframe}</span>
              )}
              {project.timeframe && project.role && (
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-accent-1" aria-hidden />
              )}
              {project.role && (
                <span className="font-mono uppercase tracking-[0.2em]">{project.role}</span>
              )}
            </div>
          )}
          <h3 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{project.title}</h3>
          <p className="max-w-xl text-lg text-muted">{project.summary}</p>
          <div className="flex flex-wrap gap-2 text-xs text-muted">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-surface-muted px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em]">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-subtle px-4 py-2 transition hover:border-accent-1 hover:text-accent-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-1 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              {label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() =>
              openPreview(
                {
                  title: project.title,
                  summary: project.summary,
                  media: project.media,
                  tags: project.tags,
                  metrics: project.metrics,
                  links: links.map(([label, href]) => ({ label, href }))
                },
                typeof window !== 'undefined'
                  ? { x: window.innerWidth / 2, y: window.innerHeight / 2 }
                  : undefined
              )
            }
            className="ml-auto inline-flex items-center gap-2 rounded-full border border-transparent px-4 py-2 font-mono text-[12px] uppercase tracking-[0.3em] text-muted transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-1 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Preview
          </button>
        </div>
      </div>
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top,_rgba(107,193,255,0.18),_transparent_70%)] opacity-0 transition group-hover:opacity-100" />
        {project.media.type === 'image' ? (
          <Image
            src={project.media.src}
            alt={project.media.alt ?? `${project.title} visual`}
            width={960}
            height={640}
            className="relative z-10 w-full rounded-3xl border border-subtle object-cover shadow-lift"
          />
        ) : (
          <video
            className="relative z-10 w-full rounded-3xl border border-subtle object-cover shadow-lift"
            src={project.media.src}
            poster={project.media.poster}
            autoPlay={isActive}
            loop
            muted
            playsInline
            preload="metadata"
          />
        )}
      </div>
    </motion.article>
  );
}
