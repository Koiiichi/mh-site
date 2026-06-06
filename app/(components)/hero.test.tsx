import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Hero } from './hero';

describe('Hero (cleanup)', () => {
  it('renders the availability chip with demoted copy', () => {
    const { getByText } = render(<Hero />);
    expect(getByText(/available — summer/i)).toBeInTheDocument();
  });

  it('keeps the Newsreader italic headline accent', () => {
    const { container } = render(<Hero />);
    const em = container.querySelector('em.font-newsreader');
    expect(em).not.toBeNull();
    expect(em?.textContent).toMatch(/outlasts/i);
    // Full headline still reads correctly.
    const h1 = container.querySelector('h1');
    expect(h1?.textContent).toMatch(/Build what outlasts\./i);
  });

  it('uses Newsreader as the headline family (king)', () => {
    const { container } = render(<Hero />);
    const h1 = container.querySelector('h1');
    expect(h1?.className).toContain('font-newsreader');
    expect(h1?.className).not.toContain('font-mincho');
  });

  it('uses a non-bold (font-normal) headline', () => {
    const { container } = render(<Hero />);
    const h1 = container.querySelector('h1');
    expect(h1?.className).toContain('font-normal');
    expect(h1?.className).not.toContain('font-semibold');
  });

  it('no longer renders the bouncing chevron or the boxed container', () => {
    const { container, queryByLabelText } = render(<Hero />);
    // The old chevron button had this aria-label; it should be gone.
    expect(queryByLabelText(/scroll to work section/i)).toBeNull();
    // No lucide chevron-down icon remains.
    expect(container.querySelector('.lucide-chevron-down')).toBeNull();
    // The rounded surface container is gone.
    expect(container.querySelector('.rounded-\\[2\\.75rem\\]')).toBeNull();
  });

  it('does not contain the old "open for work" body line', () => {
    const { container } = render(<Hero />);
    expect(container.textContent).not.toMatch(/open for work/i);
  });
});
