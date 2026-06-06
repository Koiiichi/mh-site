'use client';

interface KanjiProps {
  /** The kanji glyph. */
  char: string;
  /** Romaji reading (e.g. "inochi"). */
  romaji: string;
  /** Short English meaning (e.g. "life"). */
  meaning: string;
  className?: string;
}

/**
 * A kanji motif accent (Hiragino Mincho) with a subtle, fade-in romaji callout
 * on hover/focus. Accessible: the glyph carries an aria-label (meaning + romaji)
 * and the tooltip is decorative. Used as the site's Japanese accents (命, 今, …).
 */
export function Kanji({ char, romaji, meaning, className }: KanjiProps) {
  return (
    <span className={`group relative inline-flex cursor-default font-mincho ${className ?? ''}`} tabIndex={0}>
      <span
        role="img"
        aria-label={`${char} — ${meaning} (${romaji})`}
        lang="ja"
        className="select-none leading-none"
      >
        {char}
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-sm border border-current/20 bg-current/5 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-70 group-focus:opacity-70"
      >
        {romaji} · {meaning}
      </span>
    </span>
  );
}
