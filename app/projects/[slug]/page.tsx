import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Github, Globe, FileText, ExternalLink, Play, Award } from 'lucide-react';
import projectsData from '@/data/projects.json';
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

// Map technology names to SVG icon paths
function getTechIconPath(tech: string): string {
  const lowerTech = tech.toLowerCase();
  
  // Exact matches first
  if (lowerTech === 'react') return '/tech-icons/react.svg';
  if (lowerTech === 'python') return '/tech-icons/python.svg';
  if (lowerTech === 'typescript') return '/tech-icons/typescript.svg';
  if (lowerTech === 'next.js' || lowerTech === 'nextjs') return '/tech-icons/nextjs.svg';
  if (lowerTech === 'tailwind css' || lowerTech === 'tailwind') return '/tech-icons/tailwind.svg';
  if (lowerTech === 'firebase') return '/tech-icons/firebase.svg';
  if (lowerTech === 'vercel') return '/tech-icons/vercel.svg';
  if (lowerTech === 'c') return '/tech-icons/c.svg';
  if (lowerTech === 'pandas') return '/tech-icons/pandas.svg';
  if (lowerTech === 'fastapi') return '/tech-icons/fastapi.svg';
  if (lowerTech === 'selenium') return '/tech-icons/selenium.svg';
  
  // Partial matches
  if (lowerTech.includes('react')) return '/tech-icons/react.svg';
  if (lowerTech.includes('python')) return '/tech-icons/python.svg';
  if (lowerTech.includes('typescript')) return '/tech-icons/typescript.svg';
  if (lowerTech.includes('next')) return '/tech-icons/nextjs.svg';
  if (lowerTech.includes('tailwind')) return '/tech-icons/tailwind.svg';
  if (lowerTech.includes('firebase')) return '/tech-icons/firebase.svg';
  if (lowerTech.includes('vercel')) return '/tech-icons/vercel.svg';
  if (lowerTech.includes('pandas')) return '/tech-icons/pandas.svg';
  if (lowerTech.includes('fastapi')) return '/tech-icons/fastapi.svg';
  if (lowerTech.includes('selenium')) return '/tech-icons/selenium.svg';
  
  // Default icon for everything else
  return '/tech-icons/default.svg';
}

const projects = projectsData as unknown as Project[];

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = projects.find((entry) => entry.slug === params.slug);
  if (!project) {
    return { title: 'Project not found' };
  }
  return {
    title: `${project.title}`,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: project.media.type === 'image' ? [{ url: project.media.src }] : undefined
    }
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projects.find((entry) => entry.slug === params.slug);

  if (!project) {
    notFound();
  }

  const linkEntries = Object.entries(project.links);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-12 py-12">
      <Link href="/" className="font-mono text-xs uppercase tracking-[0.3em] text-muted transition hover:text-accent-1">
        ← Back to overview
      </Link>
      <header className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{project.title}</h1>
        <p className="text-lg text-muted">{project.summary}</p>
        <div className="flex flex-wrap gap-2 text-xs text-muted">
          {project.tags.map((tag) => {
            const iconPath = getTechIconPath(tag);
            return (
              <span key={tag} className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em]">
                <Image
                  src={iconPath}
                  alt={tag}
                  width={12}
                  height={12}
                  className="h-3 w-3 opacity-80"
                />
                {tag}
              </span>
            );
          })}
        </div>
      </header>
      <section className="space-y-6">
        {project.media.type === 'image' ? (
          <Image
            src={project.media.src}
            alt={project.media.alt ?? `${project.title} visual`}
            width={1280}
            height={720}
            className="w-full rounded-3xl border border-subtle object-cover"
          />
        ) : (
          <video
            className="w-full rounded-3xl border border-subtle object-cover"
            src={project.media.src}
            poster={project.media.poster}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          />
        )}
        <div className="grid gap-8 rounded-3xl border border-subtle bg-surface/80 p-8">
          <div>
            <h2 className="text-xl font-semibold">Role & timeframe</h2>
            <p className="text-sm text-muted">
              {project.role} · {project.timeframe}
            </p>
          </div>
          {project.metrics && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Highlights</h3>
              <ul className="mt-3 grid gap-2 text-sm text-muted">
                {project.metrics.map((metric) => (
                  <li key={metric} className="rounded-2xl bg-surface-muted px-4 py-3">
                    {metric}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {linkEntries.length > 0 && (
            <div className="flex flex-wrap gap-3 text-sm font-medium">
              {linkEntries.map(([label, href]) => {
                const iconResult = getLinkIcon(label);
                const cleanLabel = label.replace(/\s*→\s*$/, '').trim();
                const isDevpost = iconResult === 'devpost';
                const IconComponent = isDevpost ? null : iconResult;
                
                return (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-subtle px-4 py-2 transition hover:border-accent-1 hover:text-accent-1"
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
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <section className="space-y-4 text-base text-muted">
        <p>
          This case study is in progress. I’m curating deeper process notes, architecture diagrams, and learnings. Reach
          out if you’d like an early walkthrough or to explore collaboration.
        </p>
      </section>
    </div>
  );
}
