'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      date: string;
    };
  };
  repository: {
    name: string;
    html_url: string;
  };
  html_url: string;
}

export function GitHubWidget() {
  const [latestCommit, setLatestCommit] = useState<GitHubCommit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestCommit = async () => {
      try {
        // Fetch user's public events to get the latest push event
        const response = await fetch('https://api.github.com/users/Koiiichi/events/public?per_page=10');
        
        if (!response.ok) {
          throw new Error('Failed to fetch GitHub data');
        }

        const events = await response.json();
        
        // Find the latest push event
        const pushEvent = events.find((event: any) => event.type === 'PushEvent');
        
        if (pushEvent && pushEvent.payload.commits.length > 0) {
          const commit = pushEvent.payload.commits[0];
          setLatestCommit({
            sha: commit.sha,
            commit: {
              message: commit.message,
              author: {
                date: pushEvent.created_at
              }
            },
            repository: {
              name: pushEvent.repo.name,
              html_url: `https://github.com/${pushEvent.repo.name}`
            },
            html_url: `https://github.com/${pushEvent.repo.name}/commit/${commit.sha}`
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch commit data');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestCommit();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-subtle bg-surface/70 px-4 py-3">
        <div className="h-2 w-2 animate-pulse rounded-full bg-accent-1" />
        <span className="text-sm text-muted">Loading latest commit...</span>
      </div>
    );
  }

  if (error || !latestCommit) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-subtle bg-surface/70 px-4 py-3">
        <div className="h-2 w-2 rounded-full bg-muted" />
        <span className="text-sm text-muted">Unable to load GitHub activity</span>
      </div>
    );
  }

  const timeAgo = new Date(latestCommit.commit.author.date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });

  const repoName = latestCommit.repository.name.split('/')[1];
  const shortMessage = latestCommit.commit.message.split('\n')[0];
  const truncatedMessage = shortMessage.length > 50 ? shortMessage.substring(0, 50) + '...' : shortMessage;

  return (
    <motion.a
      href={latestCommit.html_url}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-3 rounded-2xl border border-subtle bg-surface/70 px-4 py-3 transition hover:border-accent-1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="h-2 w-2 rounded-full bg-accent-1"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-mono text-accent-1 group-hover:text-accent-2">{repoName}</span>
          <span className="text-muted">·</span>
          <span className="text-muted">{timeAgo}</span>
        </div>
        <p className="text-sm text-foreground group-hover:text-accent-1 truncate">
          {truncatedMessage}
        </p>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>
    </motion.a>
  );
}
