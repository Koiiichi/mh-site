/**
 * The lore page's orb behaviour, as data.
 *
 * Ōbu passes through the shapes it remembers, holding each one longer than the
 * last, until it settles on the living bonsai and stays there — the poem's
 * closing line ("each return is nearer") performed rather than described.
 * The schedule is pure so its timing is testable without a browser.
 */

export interface LoreStep {
  /** Morph target id, or null for the resting sphere. */
  id: string | null;
  /** How long this shape is held. Infinity on the final, resting step. */
  holdMs: number;
}

export const LORE_SETTLE: LoreStep[] = [
  { id: null, holdMs: 900 }, // before it decides anything
  { id: 'work', holdMs: 1100 }, // things it saw us holding
  { id: 'projects', holdMs: 1400 },
  { id: 'now', holdMs: 1800 },
  { id: 'connect', holdMs: 2300 },
  { id: 'footer', holdMs: 2900 },
  { id: 'hero', holdMs: Infinity }, // and stays
];

/** Index of the step showing at `elapsedMs` into the schedule. */
export function loreStepIndexAt(elapsedMs: number, steps: LoreStep[] = LORE_SETTLE): number {
  let remaining = Math.max(elapsedMs, 0);
  for (let i = 0; i < steps.length; i++) {
    if (remaining < steps[i].holdMs) return i;
    remaining -= steps[i].holdMs;
  }
  return steps.length - 1;
}

/** Total time before the orb comes to rest. */
export function loreSettleDurationMs(steps: LoreStep[] = LORE_SETTLE): number {
  return steps.reduce((total, step) => (step.holdMs === Infinity ? total : total + step.holdMs), 0);
}
