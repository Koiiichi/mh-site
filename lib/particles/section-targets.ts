/**
 * Maps each page section (and special states) to the morph target the sphere
 * forms. `model` is a filename resolved against MODELS_BASE; null means the
 * sphere (the resting "ball" state). Missing/failed models fall back to the
 * sphere, so the site never blocks on assets.
 *
 * Narrative: seed → living bonsai (hero) → ball → built artifact (projects) →
 * human/brain (now, the thesis) → telephone (connect) → brass bonsai (footer
 * finale, "what outlasts"). AFK idle eases back to the living bonsai.
 */

import type { ProceduralShape } from './targets';

/**
 * Base URL for morph models. Defaults to local `/models` (committed, served by
 * Vercel static). Set NEXT_PUBLIC_MODELS_BASE_URL to a CDN / Vercel Blob base
 * (no trailing slash) to serve them from external hosting instead.
 */
export const MODELS_BASE =
  process.env.NEXT_PUBLIC_MODELS_BASE_URL?.replace(/\/$/, '') || '/models';

/** Resolve a model filename to a full URL via the configured base. */
export function modelUrl(file: string): string {
  return `${MODELS_BASE}/${file}`;
}

export interface SectionTarget {
  /** Model filename (resolved via modelUrl), or null for the idle sphere. */
  model: string | null;
  /** Procedural placeholder shape (currently unused; sphere is the default). */
  fallback: ProceduralShape;
  /** Deterministic seed for any placeholder. */
  seed: number;
}

export const SECTION_TARGETS: Record<string, SectionTarget> = {
  hero: { model: 'morph-hero.glb', fallback: 'torus', seed: 1 }, // living bonsai
  work: { model: 'morph-work.glb', fallback: 'lattice', seed: 11 }, // briefcase
  projects: { model: 'morph-projects.glb', fallback: 'box', seed: 22 }, // computer
  now: { model: 'morph-now.glb', fallback: 'helix', seed: 33 }, // brain
  connect: { model: 'morph-connect.glb', fallback: 'torus', seed: 44 }, // cherry bonsai (shedding)
  footer: { model: 'morph-footer.glb', fallback: 'torus', seed: 55 }, // brass bonsai
};

/** Special (non-scroll-section) states. */
export const SPECIAL_TARGETS = {
  /** AFK idle rest — the living bonsai. */
  idle: 'morph-hero.glb',
  /** Legacy-site portal (Tardis) — reserved for a future feature. */
  legacy: 'morph-legacy.glb',
} as const;

/** Resolve the target config for a section id (defaults to the sphere). */
export function targetConfigFor(sectionId: string): SectionTarget {
  return SECTION_TARGETS[sectionId] ?? { model: null, fallback: 'torus', seed: 0 };
}

/** Section ids that morph to a model (have a non-null model). */
export function morphingSectionIds(): string[] {
  return Object.keys(SECTION_TARGETS).filter(
    (id) => SECTION_TARGETS[id].model !== null,
  );
}
