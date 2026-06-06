/**
 * Pure, DOM-free logic for deciding which page section is "active" given the
 * geometry of the sections relative to the viewport. Kept separate from the
 * React hook so it can be unit-tested without a browser.
 *
 * This is the single source of truth the particle morph state machine reads
 * from: both scroll position and nav clicks ultimately resolve to one of these
 * section ids.
 */

export const SECTION_IDS = ['hero', 'work', 'projects', 'now', 'connect', 'footer'] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export interface SectionRect {
  id: string;
  /** getBoundingClientRect().top — distance from viewport top (can be negative). */
  top: number;
  /** getBoundingClientRect().bottom. */
  bottom: number;
}

/**
 * Choose the active section: the one whose top edge has crossed the trigger
 * line (a horizontal line at `triggerRatio` of the viewport height, measured
 * from the top). Among all sections whose top is above the line, the lowest
 * one (greatest `top`) wins — that's the section currently occupying the line.
 *
 * If no section has reached the line yet (we're at the very top of the page),
 * the first section in the list is returned. Returns null for an empty list.
 */
export function selectActiveSection(
  rects: SectionRect[],
  viewportHeight: number,
  triggerRatio = 0.6,
): string | null {
  if (rects.length === 0) return null;

  const line = viewportHeight * triggerRatio;

  let activeId: string | null = null;
  let bestTop = -Infinity;

  for (const rect of rects) {
    if (rect.top <= line && rect.top > bestTop) {
      bestTop = rect.top;
      activeId = rect.id;
    }
  }

  // Nothing has crossed the line yet → default to the first section.
  return activeId ?? rects[0].id;
}
