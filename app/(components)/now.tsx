'use client';

import { motion, useReducedMotion } from 'framer-motion';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function Now() {
  const prefersReducedMotion = useReducedMotion();
  const { data } = useSWR('/api/spotify/now-playing', fetcher, { refreshInterval: 60000 });

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
          <p className="italic">
            Learning by building — chasing the satisfaction of solving a problem cleanly and
            understanding how the pieces fit together. I&apos;m drawn to systems that balance logic
            with feel — constantly thinking about how to connect abstract, ambitious ideas into
            tangible products without overwhelming the mind with the sheer complexity of building
            them using the toolset I currently have. That toolset still needs expansion and
            refinement, something that time and experience will carve naturally as a niche forms.
          </p>

          <p className="italic">
            I&apos;m exploring how agentic systems can make creation more collaborative — how small
            automations can expand what one person can build. The more I learn, the more I realize
            engineering is less about syntax and more about empathy.
          </p>

          <p className="italic">
            Lately, I&apos;ve been enjoying more contemporary sounds — textured R&B and its many
            syncopated subgenres. Ambient soundscapes otherwise drone in my ear: think{' '}
            <em>obscure Aphex Twin B-sides</em>, anything that <em>hums with intention</em> — my
            sole replacement for the <em>white noise of my ceiling fan</em>, which has become a
            limited offering.
          </p>
        </div>

        <div className="italic text-muted/70 text-base">
          {data?.isPlaying ? (
            <>
              Currently playing:{' '}
              <a
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-muted/40 hover:decoration-muted hover:text-foreground transition-colors"
              >
                &quot;{data.title}&quot; — {data.artist}
              </a>
            </>
          ) : (
            <>Not listening to anything right now.</>
          )}
        </div>
      </motion.div>
    </section>
  );
}
