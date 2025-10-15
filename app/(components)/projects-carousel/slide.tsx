'use client';

import { useHoldPreview } from '../hold-preview/hold-preview';
import { useLongPress } from '../hold-preview/useLongPress';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { Github, Globe, FileText, ExternalLink, Play, Award, Code2, Database, Palette, Cpu, Zap, Cloud, Blocks } from 'lucide-react';
import { Project } from '@/lib/types';

// Map link labels to appropriate icons
function getLinkIcon(label: string) {
  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes('devpost')) {
    return 'devpost'; // Special case for custom SVG
  }
  if (lowerLabel.includes('source') || lowerLabel.includes('github') || lowerLabel.includes('repo')) {
    return Github;
  }
  if (lowerLabel.includes('website') || lowerLabel.includes('site') || lowerLabel.includes('demo')) {
    return Globe;
  }
  if (lowerLabel.includes('documentation') || lowerLabel.includes('docs')) {
    return FileText;
  }
  if (lowerLabel.includes('listen') || lowerLabel.includes('play')) {
    return Play;
  }
  if (lowerLabel.includes('nasa') || lowerLabel.includes('space apps')) {
    return Award;
  }
  return ExternalLink;
}

// Map technology names to appropriate icons
function getTechIcon(tech: string) {
  const lowerTech = tech.toLowerCase();
  
  // Languages
  if (lowerTech.includes('typescript') || lowerTech.includes('javascript') || lowerTech.includes('python') || lowerTech.includes('c')) {
    return Code2;
  }
  
  // Frameworks & Libraries
  if (lowerTech.includes('react') || lowerTech.includes('next') || lowerTech.includes('tailwind')) {
    return Blocks;
  }
  
  // Databases & Backend
  if (lowerTech.includes('firebase') || lowerTech.includes('database') || lowerTech.includes('firestore')) {
    return Database;
  }
  
  // Cloud & Deployment
  if (lowerTech.includes('vercel') || lowerTech.includes('cloud')) {
    return Cloud;
  }
  
  // APIs & Integration
  if (lowerTech.includes('api') || lowerTech.includes('fastapi') || lowerTech.includes('openai')) {
    return Zap;
  }
  
  // Data Science & ML
  if (lowerTech.includes('pandas') || lowerTech.includes('scikit') || lowerTech.includes('numpy') || lowerTech.includes('ml')) {
    return Cpu;
  }
  
  // Design & UI
  if (lowerTech.includes('css') || lowerTech.includes('design')) {
    return Palette;
  }
  
  return Code2; // Default
}

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
            {project.tags.map((tag) => {
              const TechIcon = getTechIcon(tag);
              return (
                <span key={tag} className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em]">
                  <TechIcon className="h-3 w-3" />
                  {tag}
                </span>
              );
            })}
          </div>
          {project.metrics && project.metrics.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-muted">Highlights</h4>
              <ul className="space-y-1.5">
                {project.metrics.map((metric) => (
                  <li key={metric} className="flex items-start gap-2 text-sm text-muted">
                    <span className="mt-1.5 inline-flex h-1 w-1 flex-shrink-0 rounded-full bg-accent-1" />
                    <span>{metric}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
          {links.map(([label, href]) => {
            const iconResult = getLinkIcon(label);
            const cleanLabel = label.replace(/\s*→\s*$/, '').trim();
            const isDevpost = iconResult === 'devpost';
            const IconComponent = isDevpost ? null : iconResult;
            
            return (
              <Link
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-subtle px-4 py-2 transition hover:border-accent-1 hover:text-accent-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-1 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                {isDevpost ? (
                  <span className="inline-flex h-4 w-4 items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.002 1.61 0 12.004 6.002 22.39h11.996L24 12.004 17.998 1.61zm1.593 4.084h3.947c3.605 0 6.276 1.695 6.276 6.31 0 4.436-3.21 6.302-6.456 6.302H7.595zm2.517 2.449v7.714h1.241c2.646 0 3.862-1.55 3.862-3.861.009-2.569-1.096-3.853-3.767-3.853z"/>
                    </svg>
                  </span>
                ) : IconComponent ? (
                  <IconComponent className="h-4 w-4" />
                ) : null}
                {cleanLabel}
              </Link>
            );
          })}
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
