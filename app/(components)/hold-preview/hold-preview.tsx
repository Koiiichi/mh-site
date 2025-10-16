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
import { X } from 'lucide-react';
import { getLinkIcon, getTechIconPath } from '@/lib/icon-utils';

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

  // Lock body scroll when preview is open
  useEffect(() => {
    if (state) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [state]);

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
          onClick={onClose}
          onWheel={(e) => e.preventDefault()}
          onTouchMove={(e) => e.preventDefault()}
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
            onClick={(e) => e.stopPropagation()}
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
                          {iconPath && (
                            <Image
                              src={iconPath}
                              alt=""
                              width={12}
                              height={12}
                              className="h-3 w-3 flex-shrink-0 opacity-80"
                              aria-hidden="true"
                              onError={(event) => {
                                console.error(`Failed to load icon for ${tag}: ${iconPath}`);
                                event.currentTarget.style.display = 'none';
                              }}
                            />
                          )}
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
