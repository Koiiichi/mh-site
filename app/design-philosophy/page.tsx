import type { Metadata } from 'next';
import Link from 'next/link';
import { LorePoem } from '../(components)/lore-poem';

export const metadata: Metadata = {
  title: 'Ōbu',
  description: 'a short note on the particle orb that drifts through this site.',
};

export default function DesignPhilosophyPage() {
  return (
    <main className="lore-paper relative mx-auto flex w-full max-w-6xl flex-col gap-10 py-12 sm:py-20 md:pr-[42%]">
      <Link
        href="/"
        className="w-fit font-mono text-xs lowercase tracking-[0.3em] text-muted transition hover:text-accent-1"
      >
        back to site
      </Link>

      <header className="space-y-6">
        <p className="font-mincho text-4xl text-muted/25 select-none" aria-hidden="true">
          帯
        </p>
        <p className="font-mono text-xs lowercase tracking-[0.3em] text-muted">ōbu</p>
      </header>

      <LorePoem />

      <p className="max-w-sm text-xs leading-6 text-muted/60">
        a drift of particles that borrows the shape of whatever it settles beside. hover a word
        and it will hold that one for a moment.
      </p>
    </main>
  );
}
