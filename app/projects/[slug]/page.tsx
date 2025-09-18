import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import projectsData from '@/data/projects.json';
import { Project } from '@/lib/types';

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
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{project.title}</h1>
        <p className="text-lg text-muted">{project.summary}</p>
        <div className="flex flex-wrap gap-2 text-xs text-muted">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-surface-muted px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em]">
              {tag}
            </span>
          ))}
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
              {linkEntries.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-subtle px-4 py-2 transition hover:border-accent-1 hover:text-accent-1"
                >
                  {label}
                </a>
              ))}
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
