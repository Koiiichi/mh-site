/**
 * A one-way channel from the lore page's words to Ōbu.
 *
 * Hovering a noun in the poem lends the orb that shape for as long as the
 * pointer (or focus) stays; releasing returns it to whatever the settle
 * schedule is showing. The page never touches the particle system directly.
 */

/** A morph target id, null for the bare sphere, or undefined for "nothing lent". */
export type LoreLend = string | null | undefined;

type Listener = (lent: LoreLend) => void;

const listeners = new Set<Listener>();
let lent: LoreLend;

export const loreChannel = {
  /** Lend the orb a shape (null = the sphere). */
  lend(id: string | null) {
    lent = id;
    listeners.forEach((listener) => listener(lent));
  },
  /** Give the orb back to its own schedule. */
  release() {
    lent = undefined;
    listeners.forEach((listener) => listener(lent));
  },
  get current(): LoreLend {
    return lent;
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
