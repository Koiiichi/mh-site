'use client';

import { useClock } from '@/lib/hooks/useClock';
import { useMemo } from 'react';

function AnalogClock({ time }: { time: Date }) {
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  
  const hourAngle = (hours * 30) + (minutes * 0.5);
  const minuteAngle = minutes * 6;

  return (
    <div className="relative w-8 h-8 rounded-full border border-muted/30">
      {/* Hour hand */}
      <div
        className="absolute top-1/2 left-1/2 w-[2px] bg-foreground origin-bottom rounded-full"
        style={{
          height: '8px',
          transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`,
          transformOrigin: 'center bottom'
        }}
      />
      {/* Minute hand */}
      <div
        className="absolute top-1/2 left-1/2 w-[1px] bg-foreground origin-bottom rounded-full"
        style={{
          height: '12px',
          transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)`,
          transformOrigin: 'center bottom'
        }}
      />
      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-foreground rounded-full transform -translate-x-1/2 -translate-y-1/2" />
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

  const lastUpdated = useMemo(() => {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date());
  }, []);

  return (
    <footer className="mt-24 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-subtle bg-surface/70 px-6 py-5 text-sm text-muted">
      <div className="flex items-center gap-3">
        <AnalogClock time={now} />
        <span className="font-mono text-xs">Last updated {lastUpdated}</span>
      </div>
      <div className="flex items-center gap-3">
        <span>{humanDate}</span>
        <span>© {now.getFullYear()} Muneeb Hassan</span>
      </div>
    </footer>
  );
}
