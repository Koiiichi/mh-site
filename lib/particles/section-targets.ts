/**
 * Maps each page section to the morph target the sphere forms when that section
 * is active. `hero` is null — the sphere is the resting state. Each entry names
 * the .glb to load and the procedural placeholder to use until it exists.
 *
 * Narrative: seed (hero) -> structured systems (work) -> built artifact
 * (projects) -> human form / thesis peak (now) -> reaching outward (connect).
 */

import type { ProceduralShape } from './targets';

export interface SectionTarget {
  /** Path under /public to the .glb, or null for the idle sphere. */
  model: string | null;
  /** Procedural placeholder used until the model is present / if it fails. */
  fallback: ProceduralShape;
  /** Deterministic seed for the placeholder. */
  seed: number;
}

export const SECTION_TARGETS: Record<string, SectionTarget> = {
  hero: { model: null, fallback: 'torus', seed: 1 },
  work: { model: '/models/morph-work.glb', fallback: 'lattice', seed: 11 },
  projects: { model: '/models/morph-projects.glb', fallback: 'box', seed: 22 },
  now: { model: '/models/morph-now.glb', fallback: 'helix', seed: 33 },
  connect: { model: '/models/morph-connect.glb', fallback: 'torus', seed: 44 },
};

/** Resolve the target config for a section id (defaults to the sphere). */
export function targetConfigFor(sectionId: string): SectionTarget {
  return SECTION_TARGETS[sectionId] ?? SECTION_TARGETS.hero;
}

/** Section ids that actually morph (everything except the resting hero). */
export function morphingSectionIds(): string[] {
  return Object.keys(SECTION_TARGETS).filter(
    (id) => SECTION_TARGETS[id].model !== null,
  );
}
