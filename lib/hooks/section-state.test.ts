import { describe, it, expect } from 'vitest';
import { selectActiveSection, type SectionRect } from './section-state';

const VH = 1000;
const TRIGGER = 0.6; // line at y = 600

// Helper to build tiling sections starting at a given scroll offset.
function tiling(offset: number, heights: Record<string, number>): SectionRect[] {
  let cursor = offset;
  const out: SectionRect[] = [];
  for (const [id, h] of Object.entries(heights)) {
    out.push({ id, top: cursor, bottom: cursor + h });
    cursor += h;
  }
  return out;
}

describe('selectActiveSection', () => {
  it('returns null for no sections', () => {
    expect(selectActiveSection([], VH, TRIGGER)).toBeNull();
  });

  it('selects the first section when at the top of the page', () => {
    const rects = tiling(0, { hero: 800, work: 800, projects: 800 });
    // hero top=0 <= 600, work top=800 > 600 → hero
    expect(selectActiveSection(rects, VH, TRIGGER)).toBe('hero');
  });

  it('selects the section currently crossing the 60% line after scrolling', () => {
    // Scrolled down 700px: hero[-700..100], work[100..900], projects[900..1700]
    const rects = tiling(-700, { hero: 800, work: 800, projects: 800 });
    // tops <= 600: hero(-700), work(100). greatest is work(100) → work
    expect(selectActiveSection(rects, VH, TRIGGER)).toBe('work');
  });

  it('advances to the next section exactly as its top crosses the line', () => {
    // projects.top just above the line.
    const rects: SectionRect[] = [
      { id: 'hero', top: -1200, bottom: -400 },
      { id: 'work', top: -400, bottom: 400 },
      { id: 'projects', top: 599, bottom: 1399 },
    ];
    expect(selectActiveSection(rects, VH, TRIGGER)).toBe('projects');

    // One pixel earlier, projects has not crossed yet → still work.
    const rects2: SectionRect[] = [
      { id: 'hero', top: -1200, bottom: -400 },
      { id: 'work', top: -400, bottom: 400 },
      { id: 'projects', top: 601, bottom: 1401 },
    ];
    expect(selectActiveSection(rects2, VH, TRIGGER)).toBe('work');
  });

  it('returns the first section when every section is below the line', () => {
    // Page pushed down so even hero hasn't reached the line.
    const rects = tiling(700, { hero: 800, work: 800 });
    expect(selectActiveSection(rects, VH, TRIGGER)).toBe('hero');
  });

  it('selects the last section when scrolled to the bottom', () => {
    const rects = tiling(-2000, { hero: 800, work: 800, projects: 800, now: 800 });
    // all tops <= 600; greatest top is now(400) → now
    expect(selectActiveSection(rects, VH, TRIGGER)).toBe('now');
  });

  it('respects a custom trigger ratio', () => {
    const rects = tiling(-300, { hero: 800, work: 800 });
    // hero[-300..500], work[500..1300]
    // triggerRatio 0.4 → line=400: tops<=400: hero(-300) → hero
    expect(selectActiveSection(rects, VH, 0.4)).toBe('hero');
    // triggerRatio 0.6 → line=600: tops<=600: hero(-300), work(500) → work
    expect(selectActiveSection(rects, VH, 0.6)).toBe('work');
  });
});
