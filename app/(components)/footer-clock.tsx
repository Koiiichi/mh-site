'use client';

import { useClock } from '@/lib/hooks/useClock';
import { useMemo } from 'react';

export function FooterClock() {
  const { now, formatted } = useClock({ interval: 1000 });

  const humanDate = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        month: 'long',
        day: '2-digit',
        year: 'numeric'
      }).format(now),
    [now]
  );

  return (
    <footer className="mt-24 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-subtle bg-surface/70 px-6 py-5 text-sm text-muted">
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
        Waterloo, Canada · {formatted}
      </span>
      <span>{humanDate} · © {now.getFullYear()} Muneeb Hassan</span>
    </footer>
  );
}
