'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState } from 'react';
import buildingData from '@/data/building.json';
import { BuildingItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useHoldPreview } from '../hold-preview/hold-preview';
import type { PreviewPayload } from '../hold-preview/hold-preview';
import { useLongPress } from '../hold-preview/useLongPress';

const filters = ['All', 'Active', 'Paused', 'Exploring'] as const;

type Filter = (typeof filters)[number];

export function BuildingList() {
  const items = useMemo(() => buildingData as BuildingItem[], []);
  const [filter, setFilter] = useState<Filter>('Active');
  const { openPreview } = useHoldPreview();
  const reduceMotion = useReducedMotion();

  const filtered = useMemo(() => {
    if (filter === 'All') return items;
    return items.filter((item) => item.status === filter);
  }, [filter, items]);

  return (
    <section className="space-y-8" id="building">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Building now</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Concurrent threads</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={cn(
                'rounded-full border border-subtle px-4 py-1.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-1 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                filter === option ? 'border-accent-1 text-accent-1' : 'text-muted hover:text-foreground'
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map((item) => (
          <BuildingCard
            key={item.name}
            item={item}
            prefersReducedMotion={reduceMotion ?? false}
            openPreview={openPreview}
          />
        ))}
      </div>
    </section>
  );
}

type BuildingCardProps = {
  item: BuildingItem;
  prefersReducedMotion: boolean;
  openPreview: (payload: PreviewPayload, origin?: { x: number; y: number }) => void;
};

function BuildingCard({ item, prefersReducedMotion, openPreview }: BuildingCardProps) {
  const startedDate = useMemo(() => new Date(item.started), [item.started]);
  const startedLabel = useMemo(
    () =>
      startedDate.toLocaleDateString(undefined, {
        month: 'short',
        year: 'numeric'
      }),
    [startedDate]
  );
  const longPressHandlers = useLongPress((event) => {
    openPreview(
      {
        title: item.name,
        summary: item.description ?? '',
        tags: [item.status],
        metrics: [
          `Progress ${(item.progress * 100).toFixed(0)}%`,
          `Started ${startedLabel}`
        ],
        links: item.collaborators
          ? [{ label: 'Collaborate', href: 'mailto:muneeb@muneeb.design?subject=Collab%20idea' }]
          : undefined
      },
      event.origin
    );
  });

  const statusTone =
    item.status === 'Active' ? 'text-accent-1' : item.status === 'Paused' ? 'text-muted' : 'text-accent-2';

  return (
    <motion.article
      {...longPressHandlers}
      className="group flex flex-col gap-5 rounded-3xl border border-subtle bg-surface/80 p-6 shadow-[0_24px_60px_rgba(8,10,14,0.18)]"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: 'easeOut' }}
      tabIndex={0}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold tracking-tight text-foreground">{item.name}</h3>
        <span className={cn('font-mono text-xs uppercase tracking-[0.3em]', statusTone)}>{item.status}</span>
      </div>
      <p className="text-sm text-muted">{item.description}</p>
      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="font-mono uppercase tracking-[0.3em]">Since {startedLabel}</span>
        {item.collaborators && (
          <span className="rounded-full bg-surface-muted px-2 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-accent-2">
            Looking for collaborators
          </span>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>Progress</span>
          <span>{Math.round(item.progress * 100)}%</span>
        </div>
        <div className="h-2 rounded-full bg-border/40">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent-1 to-accent-2"
            style={{ width: `${Math.min(item.progress, 1) * 100}%` }}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() =>
            openPreview(
              {
                title: item.name,
                summary: item.description ?? '',
                tags: [item.status],
                metrics: [
                  `Progress ${(item.progress * 100).toFixed(0)}%`,
                  `Started ${startedLabel}`
                ],
                links: item.collaborators
                  ? [{ label: 'Collaborate', href: 'mailto:muneeb@muneeb.design?subject=Collab%20idea' }]
                  : undefined
              },
              typeof window !== 'undefined'
                ? { x: window.innerWidth / 2, y: window.innerHeight / 2 }
                : undefined
            )
          }
          className="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.3em] text-muted transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-1 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          Preview
        </button>
      </div>
    </motion.article>
  );
}
