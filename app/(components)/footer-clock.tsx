'use client';

import { useClock } from '@/lib/hooks/useClock';
import { useMemo } from 'react';

function AnalogClock({ time }: { time: Date }) {
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  
  const hourAngle = (hours * 30) + (minutes * 0.5);
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

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
    // Use build timestamp from environment variable (set at build/deploy time)
    const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME 
      ? new Date(process.env.NEXT_PUBLIC_BUILD_TIME)
      : new Date('2024-01-01'); // Fallback date
    
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(buildTime);
  }, []);

  return (
    <footer className="mt-24 rounded-3xl border border-subtle bg-surface/70 px-4 py-4 text-sm text-muted sm:px-6 sm:py-5">
      {/* Mobile: Stacked layout */}
      <div className="flex flex-col gap-3 sm:hidden">
        {/* Top row: Clock and date */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AnalogClock time={now} />
            <span className="font-mono text-xs">{humanDate}</span>
          </div>
          <span className="text-xs">© {now.getFullYear()}</span>
        </div>
        
        {/* Bottom row: Last Updated */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
          <span className="font-mono text-xs">Last updated {lastUpdated}</span>
        </div>
      </div>

      {/* Desktop: Horizontal layout */}
      <div className="hidden sm:flex items-center justify-between gap-4">
        {/* Left: Clock with current time */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <AnalogClock time={now} />
          <span className="font-mono text-xs">{humanDate}</span>
        </div>
        
        {/* Center: Last Updated */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
            <span className="font-mono text-xs">Last updated {lastUpdated}</span>
          </div>
        </div>
        
        {/* Right: Copyright */}
        <div className="flex-shrink-0">
          <span>© {now.getFullYear()} Muneeb Hassan</span>
        </div>
      </div>
    </footer>
  );
}
