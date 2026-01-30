'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion, AnimatePresence, useInView } from 'framer-motion';
import { useTheme } from 'next-themes';
import useSWR from 'swr';
import { RadioStatic } from './radio-static';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

// Archive entries
const archiveEntries = [
  {
    date: 'October 2024',
    content: (
      <>
        <p>
          <em>Learning by building</em> — chasing the satisfaction of solving a problem cleanly and understanding how the pieces fit together. I&apos;m drawn to systems that balance logic with feel — constantly thinking about how to connect abstract, ambitious ideas into tangible products without overwhelming the mind with the sheer complexity of building them using the toolset I currently have. That toolset still needs expansion and refinement, something that <em>time and experience will carve naturally as a niche forms.</em>
        </p>

        <p>
          I&apos;m exploring how agentic systems can make creation more collaborative — how small automations can expand what one person can build. The more I learn, the more I realize <em>engineering is less about syntax and more about empathy.</em>
        </p>

        <p>
          Lately, I&apos;ve been enjoying more contemporary sounds — textured R&amp;B and its many syncopated subgenres. Ambient soundscapes otherwise drone in my ear: think obscure Aphex Twin B-sides, anything that hums with intention — my sole replacement for the white noise of my ceiling fan, which has become a limited offering.
        </p>
      </>
    ),
  },
];

export function Now() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { margin: '-50% 0px -50% 0px' });
  const { resolvedTheme, setTheme } = useTheme();
  
  const [mode, setMode] = useState<'now' | 'then'>('now');
  const [archiveIndex, setArchiveIndex] = useState(0);
  const [isHoveringHeader, setIsHoveringHeader] = useState(false);
  const [direction, setDirection] = useState(0);
  const [originalTheme, setOriginalTheme] = useState<string | null>(null);
  
  const { data } = useSWR('/api/spotify/now-playing', fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 0,
  });

  // Theme inversion effect when section is in view
  useEffect(() => {
    if (isInView && resolvedTheme) {
      // Invert theme when entering section (permanent switch)
      if (!originalTheme) {
        setOriginalTheme(resolvedTheme);
        const invertedTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
        setTheme(invertedTheme);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView]);

  const handleModeToggle = (newMode: 'now' | 'then') => {
    setMode(newMode);
    if (newMode === 'then') {
      setArchiveIndex(0);
    }
  };

  const handleArchiveNavigation = (index: number) => {
    setDirection(index > archiveIndex ? 1 : -1);
    setArchiveIndex(index);
  };

  const currentContent = mode === 'now' ? (
    <>
      <p>
        Lately, I&apos;ve been lingering on the interdisciplinary nature of things, wondering whether everything I do is quietly linked beneath the surface. A web of ideas, habits, and abstractions stitched together by a human mind that can&apos;t help but search for continuity. As I work, I keep circling the same question: how does the mind comprehend at all, and how does this bit-based machine manage to approximate something so profoundly human? It mimics us convincingly, yet operates from a foundation that is entirely foreign.
      </p>

      <p>
        Translating human intuition into computational form has become the most challenging part of my process. Building agentic workflows forces me to confront that gap directly, aligning human approaches with systems that do not think, feel, or hesitate. The difficulty isn&apos;t technical so much as conceptual, shaping intent into something a machine can execute without stripping away the nuance that made it meaningful in the first place.
      </p>

      <p>
        Sonically or musically if you may, my habits have shifted alongside my routines. I&apos;ve moved away from droning soundscapes toward something more immediate and energetic as my days grow more active. Lately, I&apos;ve been drawn to dense, 808-heavy, almost sinister production, the kind that arrives without warning, Metro Boomin occupying much of that space. Still, I can feel myself drifting back toward more somber R&amp;B as the weather dulls and isolation creeps in, like <em>Sampha</em> waiting patiently in rotation.
      </p>
    </>
  ) : (
    archiveEntries[archiveIndex].content
  );

  return (
    <section ref={sectionRef} id="now" className="space-y-8 relative">
      <RadioStatic />
      <header 
        className="flex flex-col gap-2"
        onMouseEnter={() => setIsHoveringHeader(true)}
        onMouseLeave={() => setIsHoveringHeader(false)}
      >
        <div className="flex items-center gap-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            {mode === 'now' ? 'Present' : 'Past'}
          </p>
          {mode === 'then' && (
            <p className="font-mono text-xs text-muted/40">
              {archiveEntries[archiveIndex].date}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {mode === 'now' ? (
            <>
              {/* Now Title - Primary */}
              <motion.h2
                key="now-primary"
                initial={{ opacity: 1, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="font-newsreader italic text-2xl font-semibold tracking-tight sm:text-3xl text-foreground"
              >
                Now
              </motion.h2>
              
              {/* Then Title - Ghost */}
              <motion.h2
                key="then-ghost"
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: isHoveringHeader ? 0.6 : 0,
                  x: isHoveringHeader ? 0 : -10
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="font-newsreader italic text-2xl font-semibold tracking-tight sm:text-3xl text-muted/30 hover:text-muted/60 cursor-pointer"
                onClick={() => handleModeToggle('then')}
              >
                Then
              </motion.h2>
            </>
          ) : (
            <>
              {/* Then Title - Primary (in Now's position) */}
              <motion.h2
                key="then-primary"
                initial={{ opacity: 1, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="font-newsreader italic text-2xl font-semibold tracking-tight sm:text-3xl text-foreground"
              >
                Then
              </motion.h2>
              
              {/* Now Title - Ghost (in Then's position) */}
              <motion.h2
                key="now-ghost"
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: isHoveringHeader ? 0.6 : 0,
                  x: isHoveringHeader ? 0 : -10
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="font-newsreader italic text-2xl font-semibold tracking-tight sm:text-3xl text-muted/30 hover:text-muted/60 cursor-pointer"
                onClick={() => handleModeToggle('now')}
              >
                Now
              </motion.h2>
            </>
          )}
        </div>
      </header>

      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="space-y-6"
      >
        {/* Text Section */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={mode === 'now' ? 'now-content' : `then-content-${archiveIndex}`}
            custom={direction}
            initial={prefersReducedMotion ? {} : { 
              opacity: 0, 
              x: direction * 20 
            }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReducedMotion ? {} : { 
              opacity: 0, 
              x: direction * -20 
            }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="text-base leading-relaxed text-muted/80 space-y-4 max-w-3xl"
          >
            {currentContent}
          </motion.div>
        </AnimatePresence>

        {/* Archive Navigation Dots */}
        {mode === 'then' && archiveEntries.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 py-2"
          >
            {archiveEntries.map((_, index) => (
              <button
                key={index}
                onClick={() => handleArchiveNavigation(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === archiveIndex
                    ? 'bg-muted/60 scale-110'
                    : 'bg-muted/20 hover:bg-muted/40 hover:scale-110'
                }`}
                aria-label={`View archive entry ${index + 1}`}
              />
            ))}
          </motion.div>
        )}

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
