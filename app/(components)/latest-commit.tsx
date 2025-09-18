'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type CommitState =
  | { status: 'loading' }
  | { status: 'ready'; repo: string; message: string; url: string; time: string }
  | { status: 'error' };

const GITHUB_EVENTS_ENDPOINT = 'https://api.github.com/users/Koiiichi/events/public?per_page=5';

export function LatestCommitCard() {
  const [state, setState] = useState<CommitState>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();

    async function fetchLatestCommit() {
      try {
        const response = await fetch(GITHUB_EVENTS_ENDPOINT, {
          cache: 'no-store',
          signal: controller.signal,
          headers: {
            Accept: 'application/vnd.github+json'
          }
        });

        if (!response.ok) {
          throw new Error('Request failed');
        }

        const events: GithubEvent[] = await response.json();
        const pushEvent = events.find((event) => event.type === 'PushEvent' && event.payload?.commits?.length);

        if (!pushEvent || !pushEvent.payload?.commits || pushEvent.payload.commits.length === 0) {
          setState({ status: 'error' });
          return;
        }

        const commits = pushEvent.payload.commits;
        const lastCommit = commits[commits.length - 1];
        const message = (lastCommit?.message ?? 'Updated repository').split('\n')[0].trim();
        const url = `https://github.com/${pushEvent.repo.name}/commit/${lastCommit?.sha}`;

        const timeFormatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
        const created = new Date(pushEvent.created_at);
        const diffMs = Date.now() - created.getTime();
        const diffMinutes = Math.round(diffMs / (1000 * 60));
        let time: string;
        if (diffMinutes <= 1) {
          time = 'just now';
        } else if (diffMinutes < 60) {
          time = timeFormatter.format(-diffMinutes, 'minute');
        } else if (diffMinutes < 60 * 24) {
          time = timeFormatter.format(-Math.round(diffMinutes / 60), 'hour');
        } else {
          time = timeFormatter.format(-Math.round(diffMinutes / (60 * 24)), 'day');
        }

        setState({
          status: 'ready',
          repo: pushEvent.repo.name,
          message,
          url,
          time
        });
      } catch (error) {
        if ((error as { name?: string }).name === 'AbortError') return;
        setState({ status: 'error' });
      }
    }

    fetchLatestCommit();

    return () => controller.abort();
  }, []);

  return (
    <article
      data-surface
      className="flex flex-col gap-3 rounded-3xl border border-subtle bg-surface/80 p-6 shadow-[0_20px_60px_rgba(8,10,14,0.16)]"
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Latest commit</span>
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
          {state.status === 'ready' ? state.time : state.status === 'loading' ? 'Loading…' : 'Offline'}
        </span>
      </div>
      {state.status === 'ready' ? (
        <>
          <Link
            href={state.url}
            target="_blank"
            rel="noreferrer"
            className="text-lg font-semibold text-foreground transition hover:text-accent-1"
          >
            {state.repo}
          </Link>
          <p className="text-sm text-muted">{state.message}</p>
        </>
      ) : state.status === 'loading' ? (
        <div className="space-y-2 text-sm text-muted">
          <div className="h-3 w-3/4 rounded-full bg-border/60" aria-hidden />
          <div className="h-3 w-2/3 rounded-full bg-border/40" aria-hidden />
        </div>
      ) : (
        <p className="text-sm text-muted">GitHub rate limit reached — try again soon.</p>
      )}
    </article>
  );
}

type GithubEvent = {
  type: string;
  created_at: string;
  repo: { name: string };
  payload: {
    commits?: { sha: string; message: string }[];
  };
};
