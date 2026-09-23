'use client';

import { useEffect } from 'react';
import { loreChannel } from '@/lib/particles/lore-channel';

/**
 * The poem, with a few of its nouns wired to Ōbu: hover (or focus) one and the
 * orb borrows that shape until you let go — "it borrows what is Near". The
 * margin variant is the word left unchosen, the way Dickinson left alternates
 * in her fascicles; lending the jar is the only way to see it.
 */

interface WordProps {
  /** Morph target id to lend, or null for the bare sphere. */
  lends: string | null;
  children: React.ReactNode;
}

function Word({ lends, children }: WordProps) {
  return (
    <button
      type="button"
      onMouseEnter={() => loreChannel.lend(lends)}
      onMouseLeave={() => loreChannel.release()}
      onFocus={() => loreChannel.lend(lends)}
      onBlur={() => loreChannel.release()}
      className="cursor-help underline decoration-dotted decoration-from-font underline-offset-4 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
    >
      {children}
    </button>
  );
}

export function LorePoem() {
  // Never leave the orb holding a lent shape after the page goes away.
  useEffect(() => () => loreChannel.release(), []);

  return (
    <div className="font-mincho text-lg leading-[2.1] text-muted sm:text-xl">
      <p>
        it has no form to speak of —
        <br />
        it borrows what is <Word lends={null}>Near</Word> —
        <br />a <Word lends="hero">Bonsai</Word> — for the century
        <br />
        it keeps inside a year —
        <span className="ml-3 align-top font-mono text-[10px] tracking-[0.18em] text-muted/50">
          + <Word lends="jar">a jar</Word>
        </span>
      </p>

      <p className="mt-8">
        it drops the rest like <Word lends="projects">weather</Word> —
        <br />
        remembers what it Liked —
        <br />
        and each return is nearer
        <br />
        to the thing it almost was —
      </p>
    </div>
  );
}
