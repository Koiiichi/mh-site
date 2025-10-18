'use client';

import { motion, useReducedMotion } from 'framer-motion';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function Now() {
  const prefersReducedMotion = useReducedMotion();
  const { data } = useSWR('/api/spotify/now-playing', fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 0,
  });

  return (
    <section id="now" className="space-y-8">
      <header className="flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Present</p>
        <h2 className="font-newsreader italic text-2xl font-semibold tracking-tight sm:text-3xl">Now</h2>
      </header>
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="space-y-6"
      >
        <div className="text-base leading-relaxed text-muted/80 space-y-4 max-w-3xl">
          <p>
  <em>Learning by building</em> — chasing the satisfaction of solving a problem cleanly and understanding how the pieces fit together.
  I&apos;m drawn to systems that balance logic with feel — constantly thinking about how to connect abstract, ambitious ideas into tangible products
  without overwhelming the mind with the sheer complexity of building them using the toolset I currently have.
  That toolset still needs expansion and refinement, something that <em>time and experience will carve naturally as a niche forms.</em>
</p>

<p>
  I&apos;m exploring how agentic systems can make creation more collaborative — how small automations can expand what one person can build.
  The more I learn, the more I realize <em>engineering is less about syntax and more about empathy.</em>
</p>

<p>
  Lately, I&apos;ve been enjoying more contemporary sounds — textured R&amp;B and its many syncopated subgenres.{' '}
    Ambient soundscapes otherwise drone in my ear: think obscure Aphex Twin B-sides, anything that hums with intention —
    my sole replacement for the white noise of my ceiling fan, which has become a limited offering.
</p>

        </div>

        <div className="text-muted/30 text-sm">—</div>

        <div className="italic text-muted/70 text-base">
          {data?.isPlaying ? (
            <div className="flex items-center gap-2">
              <motion.div
                animate={prefersReducedMotion ? {} : { rotate: 360 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="flex-shrink-0"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-muted/50"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </motion.div>
              <span>
                Currently playing:{' '}
                <a
                  href={data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-muted/40 hover:decoration-muted hover:text-foreground transition-colors"
                >
                  &quot;{data.title}&quot; — {data.artist}
                </a>
                {data.context && (
                  <>
                    {' '}
                    from <span className="font-medium">{data.context}</span>
                  </>
                )}
              </span>
            </div>
          ) : data?.lastPlayed ? (
            <>
              Last played:{' '}
              <a
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-muted/40 hover:decoration-muted hover:text-foreground transition-colors"
              >
                &quot;{data.lastPlayed}&quot; — {data.artist}
              </a>
              {data.context && (
                <>
                  {' '}
                  from <span className="font-medium">{data.context}</span>
                </>
              )}
            </>
          ) : (
            <>Not listening to anything right now.</>
          )}
        </div>
      </motion.div>
    </section>
  );
}
