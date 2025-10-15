'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from 'react';
import { createPortal } from 'react-dom';
import { X, Github, Globe, FileText, ExternalLink, Play, Award } from 'lucide-react';

// Map link labels to appropriate icons
function getLinkIcon(label: string) {
  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes('devpost')) {
    return 'devpost'; // Special case for custom SVG
  }
  if (lowerLabel.includes('source') || lowerLabel.includes('github') || lowerLabel.includes('repo')) {
    return Github;
  }
  if (lowerLabel.includes('website') || lowerLabel.includes('site') || lowerLabel.includes('demo')) {
    return Globe;
  }
  if (lowerLabel.includes('documentation') || lowerLabel.includes('docs')) {
    return FileText;
  }
  if (lowerLabel.includes('listen') || lowerLabel.includes('play')) {
    return Play;
  }
  if (lowerLabel.includes('nasa') || lowerLabel.includes('space apps')) {
    return Award;
  }
  return ExternalLink;
}

// Map technology names to SVG icon paths
function getTechIconPath(tech: string): string {
  const lowerTech = tech.toLowerCase();
  
  // Exact matches first
  if (lowerTech === 'react') return '/tech-icons/react.svg';
  if (lowerTech === 'python') return '/tech-icons/python.svg';
  if (lowerTech === 'typescript') return '/tech-icons/typescript.svg';
  if (lowerTech === 'next.js' || lowerTech === 'nextjs') return '/tech-icons/nextjs.svg';
  if (lowerTech === 'tailwind css' || lowerTech === 'tailwind') return '/tech-icons/tailwind.svg';
  if (lowerTech === 'firebase') return '/tech-icons/firebase.svg';
  if (lowerTech === 'vercel') return '/tech-icons/vercel.svg';
  if (lowerTech === 'c') return '/tech-icons/c.svg';
  if (lowerTech === 'pandas') return '/tech-icons/pandas.svg';
  if (lowerTech === 'fastapi') return '/tech-icons/fastapi.svg';
  if (lowerTech === 'selenium') return '/tech-icons/selenium.svg';
  if (lowerTech === 'scikit-learn') return '/tech-icons/scikit-learn.svg';
  if (lowerTech === 'make') return '/tech-icons/make.svg';
  if (lowerTech === 'compilers' || lowerTech === 'compiler') return '/tech-icons/compiler.svg';
  if (lowerTech === 'vm') return '/tech-icons/vm.svg';
  if (lowerTech === 'deepseek api' || lowerTech === 'deepseek') return '/tech-icons/deepseek.svg';
  if (lowerTech === 'openseadragon') return '/tech-icons/openseadragon.svg';
  if (lowerTech === 'typer') return '/tech-icons/typer.svg';
  if (lowerTech === 'openai api' || lowerTech === 'openai') return '/tech-icons/openai.svg';
  if (lowerTech === 'midi') return '/tech-icons/midi.svg';
  if (lowerTech === 'data visualization') return '/tech-icons/data-viz.svg';
  
  // Partial matches
  if (lowerTech.includes('react')) return '/tech-icons/react.svg';
  if (lowerTech.includes('python')) return '/tech-icons/python.svg';
  if (lowerTech.includes('typescript')) return '/tech-icons/typescript.svg';
  if (lowerTech.includes('next')) return '/tech-icons/nextjs.svg';
  if (lowerTech.includes('tailwind')) return '/tech-icons/tailwind.svg';
  if (lowerTech.includes('firebase')) return '/tech-icons/firebase.svg';
  if (lowerTech.includes('vercel')) return '/tech-icons/vercel.svg';
  if (lowerTech.includes('pandas')) return '/tech-icons/pandas.svg';
  if (lowerTech.includes('fastapi')) return '/tech-icons/fastapi.svg';
  if (lowerTech.includes('selenium')) return '/tech-icons/selenium.svg';
  if (lowerTech.includes('scikit')) return '/tech-icons/scikit-learn.svg';
  if (lowerTech.includes('compiler')) return '/tech-icons/compiler.svg';
  if (lowerTech.includes('deepseek')) return '/tech-icons/deepseek.svg';
  if (lowerTech.includes('openai')) return '/tech-icons/openai.svg';
  if (lowerTech.includes('data viz')) return '/tech-icons/data-viz.svg';
  
  // Default icon for everything else
  return '/tech-icons/default.svg';
}

type PreviewLink = {
  label: string;
  href: string;
};

export type PreviewMedia =
  | { type: 'image'; src: string; alt?: string }
  | { type: 'video'; src: string; poster?: string; alt?: string };

export type PreviewPayload = {
  title: string;
  summary: string;
  metrics?: string[];
  tags?: string[];
  media?: PreviewMedia;
  links?: PreviewLink[];
};

type PreviewState = {
  payload: PreviewPayload;
  position: { x: number; y: number };
};

type PreviewContextValue = {
  openPreview: (payload: PreviewPayload, origin?: { x: number; y: number }) => void;
  closePreview: () => void;
};

const PreviewContext = createContext<PreviewContextValue | undefined>(undefined);

export function HoldPreviewProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PreviewState | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const openPreview = useCallback((payload: PreviewPayload, origin?: { x: number; y: number }) => {
    const defaultPosition = typeof window !== 'undefined'
      ? { x: window.innerWidth / 2, y: window.innerHeight / 2 }
      : { x: 0, y: 0 };
    setState({ payload, position: origin ?? defaultPosition });
  }, []);

  const closePreview = useCallback(() => setState(null), []);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePreview();
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [closePreview]);

  const value = useMemo(() => ({ openPreview, closePreview }), [openPreview, closePreview]);

  return (
    <PreviewContext.Provider value={value}>
      {children}
      {mounted && <PreviewPortal state={state} onClose={closePreview} />}
    </PreviewContext.Provider>
  );
}

export function useHoldPreview() {
  const context = useContext(PreviewContext);
  if (!context) {
    throw new Error('useHoldPreview must be used within HoldPreviewProvider');
  }
  return context;
}

function PreviewPortal({ state, onClose }: { state: PreviewState | null; onClose: () => void }) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!state) return;
    containerRef.current?.focus({ preventScroll: true });
  }, [state]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {state && (
        <motion.div
          className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            ref={containerRef}
            tabIndex={-1}
            drag
            dragMomentum={false}
            dragConstraints={{ left: -80, right: 80, top: -80, bottom: 80 }}
            initial={{
              opacity: 0,
              scale: prefersReducedMotion ? 1 : 0.9,
              x:
                typeof window !== 'undefined'
                  ? state.position.x - window.innerWidth / 2
                  : 0,
              y:
                typeof window !== 'undefined'
                  ? state.position.y - window.innerHeight / 2
                  : 0
            }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: 'easeOut' }}
            className="relative w-[min(520px,calc(100vw-2rem))] cursor-grab rounded-3xl border border-subtle bg-surface p-6 text-left shadow-floating"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full border border-transparent p-1 text-muted transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-1 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              aria-label="Close preview"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="space-y-4">
              {state.payload.media && <PreviewMediaBlock media={state.payload.media} title={state.payload.title} />}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold tracking-tight">{state.payload.title}</h3>
                <p className="text-sm text-muted">{state.payload.summary}</p>
                {state.payload.metrics && state.payload.metrics.length > 0 && (
                  <ul className="flex flex-wrap gap-2 text-xs text-muted">
                    {state.payload.metrics.map((metric) => (
                      <li key={metric} className="rounded-full border border-subtle px-3 py-1 text-[11px] uppercase tracking-widest">
                        {metric}
                      </li>
                    ))}
                  </ul>
                )}
                {state.payload.tags && (
                  <div className="flex flex-wrap gap-2 text-xs text-muted">
                    {state.payload.tags.map((tag) => {
                      const iconPath = getTechIconPath(tag);
                      return (
                        <span key={tag} className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide">
                          <Image
                            src={iconPath}
                            alt={tag}
                            width={12}
                            height={12}
                            className="h-3 w-3 opacity-80"
                          />
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
              {state.payload.links && state.payload.links.length > 0 && (
                <div className="flex flex-wrap gap-3 text-sm font-medium">
                  {state.payload.links.map((link) => {
                    const iconResult = getLinkIcon(link.label);
                    const cleanLabel = link.label.replace(/\s*→\s*$/, '').trim();
                    const isDevpost = iconResult === 'devpost';
                    const IconComponent = isDevpost ? null : iconResult;
                    
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-subtle px-3 py-1.5 transition hover:border-accent-1 hover:text-accent-1"
                      >
                        {isDevpost ? (
                          <span className="inline-flex h-4 w-4 items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6.002 1.61 0 12.004 6.002 22.39h11.996L24 12.004 17.998 1.61zm1.593 4.084h3.947c3.605 0 6.276 1.695 6.276 6.31 0 4.436-3.21 6.302-6.456 6.302H7.595zm2.517 2.449v7.714h1.241c2.646 0 3.862-1.55 3.862-3.861.009-2.569-1.096-3.853-3.767-3.853z"/>
                            </svg>
                          </span>
                        ) : IconComponent ? (
                          <IconComponent className="h-4 w-4" />
                        ) : null}
                        {cleanLabel}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function PreviewMediaBlock({ media, title }: { media: PreviewMedia; title: string }) {
  if (media.type === 'video') {
    return (
      <video
        className="h-56 w-full rounded-2xl border border-subtle object-cover"
        src={media.src}
        poster={media.poster}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
    );
  }

  return (
    <Image
      src={media.src}
      alt={media.alt ?? `${title} preview`}
      width={960}
      height={540}
      className="h-56 w-full rounded-2xl border border-subtle object-cover"
    />
  );
}
