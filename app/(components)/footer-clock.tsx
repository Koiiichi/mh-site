'use client';

import { useClock } from '@/lib/hooks/useClock';
import Link from 'next/link';
import { useMemo } from 'react';
import { Kanji } from './kanji';

function AnalogClock({ time }: { time: Date }) {
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  
  const hourAngle = (hours * 30) + (minutes * 0.5);
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

  return (
    <div className="relative w-8 h-8 rounded-full border border-current/30">
      {/* Hour hand */}
      <div
        className="absolute top-1/2 left-1/2 w-[2px] bg-current origin-bottom rounded-full"
        style={{
          height: '8px',
          transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`,
          transformOrigin: 'center bottom'
        }}
      />
      {/* Minute hand */}
      <div
        className="absolute top-1/2 left-1/2 w-[1px] bg-current origin-bottom rounded-full"
        style={{
          height: '12px',
          transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)`,
          transformOrigin: 'center bottom'
        }}
      />
      {/* Second hand */}
      <div
        className="absolute top-1/2 left-1/2 w-[0.5px] bg-accent-1 origin-bottom rounded-full transition-transform duration-1000 ease-linear"
        style={{
          height: '10px',
          transform: `translate(-50%, -100%) rotate(${secondAngle}deg)`,
          transformOrigin: 'center bottom'
        }}
      />
      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-current rounded-full transform -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}

export function FooterClock() {
  const { now } = useClock({ interval: 1000 });

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
    <footer
      id="footer"
      className="overflow-hidden rounded-3xl bg-foreground px-6 py-16 text-background sm:px-12 sm:py-24"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-12">
        {/* A single closing kanji, the end. The Now section carries the prose. */}
        <Kanji char="終" romaji="owari" meaning="the end" className="text-5xl text-background/80" />

        {/* Hairline + clock / copyright */}
        <div className="flex w-full flex-col gap-4 border-t border-background/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <AnalogClock time={now} />
            <span className="font-mono text-xs text-background/70">{humanDate}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-background/70">
            <Link
              href="/design-philosophy"
              className="text-background/45 transition hover:text-background/70"
            >
              design philosophy
            </Link>
            <span>© {now.getFullYear()} Muneeb Hassan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
