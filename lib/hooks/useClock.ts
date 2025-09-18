'use client';

import { useEffect, useMemo, useState } from 'react';

export function useClock(options?: { interval?: number; locale?: string; timeZone?: string }) {
  const interval = options?.interval ?? 1000;
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => {
      setNow(new Date());
    }, interval);
    return () => window.clearInterval(id);
  }, [interval]);

  const formatter = useMemo(() => {
    return new Intl.DateTimeFormat(options?.locale ?? undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: options?.timeZone
    });
  }, [options?.locale, options?.timeZone]);

  return {
    now,
    formatted: formatter.format(now)
  };
}
