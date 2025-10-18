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
        {/* Text Section */}
        <div className="text-base leading-relaxed text-muted/80 space-y-4 max-w-3xl">
          <p>
            <em>Learning by building</em> — chasing the satisfaction of solving a problem cleanly and understanding how the pieces fit together. I&apos;m drawn to systems that balance logic with feel — constantly thinking about how to connect abstract, ambitious ideas into tangible products without overwhelming the mind with the sheer complexity of building them using the toolset I currently have. That toolset still needs expansion and refinement, something that <em>time and experience will carve naturally as a niche forms.</em>
          </p>

          <p>
            I&apos;m exploring how agentic systems can make creation more collaborative — how small automations can expand what one person can build. The more I learn, the more I realize <em>engineering is less about syntax and more about empathy.</em>
          </p>

          <p>
            Lately, I&apos;ve been enjoying more contemporary sounds — textured R&amp;B and its many syncopated subgenres.{' '}
            <em>Ambient soundscapes otherwise drone in my ear: think obscure Aphex Twin B-sides, anything that hums with intention — my sole replacement for the white noise of my ceiling fan, which has become a limited offering.</em>
          </p>
        </div>

        <div className="text-muted/30 text-sm">—</div>

        {/* Spotify Now Playing */}
        <div className="italic text-muted/70 text-base">
          {data?.isPlaying ? (
            <div className="flex items-center gap-3 group">
              <motion.div
                animate={prefersReducedMotion ? {} : { rotate: 360 }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="relative flex-shrink-0"
                style={{
                  opacity: data?.isPlaying ? 1 : 0.5,
                }}
              >
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-muted/60"
                >
                  {/* Vinyl Base */}
                  <defs>
                    <radialGradient id="vinylLight" cx="30%" cy="30%" r="80%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
                      <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
                    </radialGradient>
                  </defs>

                  <circle cx="12" cy="12" r="10.5" fill="url(#vinylLight)" stroke="none" />

                  {/* Grooves */}
                  <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
                  <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
                  <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />

                  {/* Label */}
                  <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.6" />
                  <circle cx="12" cy="12" r="0.9" fill="rgba(0,0,0,0.9)" />

                  {/* Highlight reflection */}
                  <motion.path
                    d="M 5 5 A 10 10 0 0 1 19 5"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                    strokeLinecap="round"
                    opacity="0.2"
                    animate={prefersReducedMotion ? {} : { opacity: [0.15, 0.35, 0.15] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </svg>
              </motion.div>

              <span className="group-hover:text-foreground transition-colors">
                Currently playing:{' '}
                <a
                  href={data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-muted/40 hover:decoration-muted hover:text-foreground transition-all hover:scale-[1.01] inline-block"
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