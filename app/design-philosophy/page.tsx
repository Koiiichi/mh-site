import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ōbu',
  description: 'A small lore note for the particle entity that moves through the portfolio.',
};

export default function DesignPhilosophyPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 py-12 sm:py-20 md:pr-[42%]">
      <Link
        href="/"
        className="w-fit font-mono text-xs uppercase tracking-[0.3em] text-muted transition hover:text-accent-1"
      >
        Back to site
      </Link>

      <header className="space-y-5">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">The lore of Ōbu</p>
        <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
          A small cloud that remembers every shape it has carried.
        </h1>
      </header>

      <section className="space-y-6 text-base leading-8 text-muted">
        <p>
          Ōbu begins as a loose sphere, a quiet body of particles waiting for a reason to gather.
          It is less a mascot than a witness. It drifts beside the page and changes form when the
          story asks something new of it.
        </p>
        <p>
          When the site opens, Ōbu becomes a living bonsai. It is growth, patience, and the first
          draft of a self. Later it borrows other shapes for work, projects, and thought, but the
          particles are always the same. The form changes. The memory stays.
        </p>
        <p>
          Near the end, the tree returns. First as a cherry bonsai, softer and more scattered, then
          as bronze bonsai, quieter and more permanent. It is not an ending as much as a record of
          what passed through.
        </p>
        <p>
          On this page, Ōbu repeats its oldest cycle: sphere, living bonsai, cherry bonsai, bronze
          bonsai. A small ritual for the thing that holds the whole portfolio together.
        </p>
      </section>

      <section className="grid gap-3 border-t border-subtle pt-6 text-sm text-muted sm:grid-cols-2">
        {[
          ['01', 'Sphere', 'Before intention. The particles wait.'],
          ['02', 'Living bonsai', 'Growth, patience, and the first shape.'],
          ['03', 'Cherry bonsai', 'A softer return near the end of the path.'],
          ['04', 'Bronze bonsai', 'What remains after motion settles.'],
        ].map(([index, title, body]) => (
          <div key={title} className="space-y-2 rounded-lg border border-subtle px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted/60">{index}</p>
            <h2 className="text-sm font-medium text-foreground">{title}</h2>
            <p>{body}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
