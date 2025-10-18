'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SpotifyData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  url?: string;
}

export function Now() {
  const [spotifyData, setSpotifyData] = useState<SpotifyData | null>(null);
  const [loading, setLoading] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await fetch('/api/spotify/now-playing');
        if (response.ok) {
          const data = await response.json();
          setSpotifyData(data);
        }
      } catch (error) {
        console.error('Failed to fetch Spotify data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNowPlaying();

    // Refresh every 30 seconds
    const interval = setInterval(fetchNowPlaying, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="now" className="py-24 md:py-32">
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-prose mx-auto"
      >
        <h2 className="text-sm uppercase tracking-wide text-muted-foreground/60 mb-8">
          Now
        </h2>

        <div className="text-base leading-relaxed text-muted-foreground/80 space-y-4">
          <p>
            Learning by building — chasing the satisfaction of solving a problem cleanly and
            understanding how the pieces fit together. I&apos;m drawn to systems that balance logic
            with feel — constantly thinking about how to connect abstract, ambitious ideas into
            tangible products without overwhelming the mind with the sheer complexity of building
            them using the toolset I currently have. That toolset still needs expansion and
            refinement, something that time and experience will carve naturally as a niche forms.
          </p>

          <p>
            I&apos;m exploring how agentic systems can make creation more collaborative, how small
            automations can expand what one person can build. The more I learn, the more I realize
            engineering is less about syntax and more about empathy.
          </p>

          <p>
            Lately, I&apos;ve been enjoying more contemporary sounds — textured R&B and its many
            syncopated subgenres. Ambient soundscapes otherwise drone in my ear: think{' '}
            <em>obscure Aphex Twin B-sides</em>, anything that <em>hums with intention</em> — my
            quiet replacement for the <em>white noise of my ceiling fan</em>, which has become a
            limited offering.{' '}
            {!loading && spotifyData?.isPlaying && (
              <>
                Been enjoying{' '}
                <a
                  href={spotifyData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-muted-foreground/40 hover:decoration-muted-foreground transition"
                >
                  &ldquo;{spotifyData.title}&rdquo; by {spotifyData.artist}
                </a>
                .
              </>
            )}
          </p>

          {!loading && spotifyData && (
            <p className="italic text-muted-foreground/70 mt-6">
              {spotifyData.isPlaying ? (
                <>
                  Currently playing:{' '}
                  <a
                    href={spotifyData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-muted-foreground/40 hover:decoration-muted-foreground transition"
                  >
                    &ldquo;{spotifyData.title}&rdquo; — {spotifyData.artist}
                  </a>
                </>
              ) : (
                <>Not listening to anything right now.</>
              )}
            </p>
          )}
        </div>
      </motion.div>
    </section>
  );
}
