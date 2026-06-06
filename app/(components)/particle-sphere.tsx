'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useReducedMotion } from 'framer-motion';
import { ParticleSystem } from '@/lib/particles/ParticleSystem';
import { screenToNdc } from '@/lib/particles/math';
import { particleCountForWidth } from '@/lib/particles/perf';
import { loadGLB } from '@/lib/particles/loadTarget';
import { SECTION_TARGETS, targetConfigFor } from '@/lib/particles/section-targets';
import { useScrollSection } from '@/lib/hooks/useScrollSection';

// Monochrome etching palette: near-black on light, near-white on dark.
const COLORS = { light: '#1a1a1a', dark: '#e8e8e8' } as const;

function colorFor(theme: string | undefined): string {
  return theme === 'light' ? COLORS.light : COLORS.dark;
}

/**
 * Persistent, full-bleed particle sphere behind all page content.
 *
 * A fresh <canvas> is created per effect run (and removed on cleanup) rather
 * than reusing a React-rendered node. This avoids the Strict Mode / hot-reload
 * trap where forceContextLoss() on cleanup poisons a shared canvas, leaving the
 * next renderer bound to a dead WebGL context.
 *
 * The active scroll section (useScrollSection) is the single source of truth
 * for what shape the sphere forms; nav clicks feed it for free via smooth
 * scroll. Section -> morph-target buffers preload (real .glb or placeholder).
 */
export function ParticleSphere() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const systemRef = useRef<ParticleSystem | null>(null);
  const buffersRef = useRef<Map<string, Float32Array>>(new Map());
  const activeRef = useRef<string>('hero');

  const { resolvedTheme } = useTheme();
  const reducedMotion = useReducedMotion();
  const { activeId } = useScrollSection();

  // Create / tear down the system (and its canvas). Recreate if reduced-motion
  // flips.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Fresh canvas every run — never reuse one whose context was force-lost.
    const canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    const system = new ParticleSystem(canvas, {
      reducedMotion: !!reducedMotion,
      color: colorFor(resolvedTheme),
      count: particleCountForWidth(window.innerWidth),
    });
    systemRef.current = system;

    let detach = () => {};

    if (system.supported) {
      const resize = () =>
        system.setSize(
          window.innerWidth,
          window.innerHeight,
          window.devicePixelRatio || 1,
        );
      resize();
      system.start();
      window.addEventListener('resize', resize);

      // Cursor attractor — desktop pointers only.
      const finePointer =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(pointer: fine)').matches;

      const onPointerMove = (e: PointerEvent) => {
        const { x, y } = screenToNdc(
          e.clientX,
          e.clientY,
          window.innerWidth,
          window.innerHeight,
        );
        system.setCursor(x, y, true);
      };
      const onPointerLeave = () => system.setCursor(0, 0, false);

      if (finePointer && !reducedMotion) {
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        document.addEventListener('pointerleave', onPointerLeave);
      }

      const onVisibility = () => {
        if (document.hidden) system.stop();
        else system.start();
      };
      if (!reducedMotion) {
        document.addEventListener('visibilitychange', onVisibility);
      }

      // Preload each section's real .glb model. If a model is missing/fails,
      // that section simply stays the sphere (no procedural placeholder) — the
      // sphere is the default until a real asset is dropped in public/models.
      let cancelled = false;
      if (!reducedMotion) {
        for (const id of Object.keys(SECTION_TARGETS)) {
          const cfg = targetConfigFor(id);
          if (!cfg.model) continue;
          loadGLB(cfg.model, system.particleCount)
            .then((buf) => {
              if (cancelled) return;
              buffersRef.current.set(id, buf);
              if (activeRef.current === id) system.showShape(buf);
            })
            .catch(() => {
              /* No model yet → section stays the sphere. */
            });
        }
      }

      detach = () => {
        cancelled = true;
        window.removeEventListener('resize', resize);
        window.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerleave', onPointerLeave);
        document.removeEventListener('visibilitychange', onVisibility);
      };
    }

    return () => {
      detach();
      system.dispose();
      systemRef.current = null;
      canvas.remove();
    };
    // resolvedTheme + activeId handled in their own effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  // Drive the morph state machine from the active scroll section.
  useEffect(() => {
    activeRef.current = activeId;
    const system = systemRef.current;
    if (!system || !system.supported || reducedMotion) return;

    const cfg = targetConfigFor(activeId);
    if (!cfg.model) {
      system.showShape(null); // hero → sphere
      return;
    }
    system.showShape(buffersRef.current.get(activeId) ?? null);
  }, [activeId, reducedMotion]);

  // Update color on theme change without rebuilding the scene.
  useEffect(() => {
    systemRef.current?.setColor(colorFor(resolvedTheme));
  }, [resolvedTheme]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
