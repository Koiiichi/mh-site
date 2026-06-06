import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Clean up the DOM between tests.
afterEach(() => {
  cleanup();
});

// jsdom does not implement matchMedia; provide a permissive default mock so
// components that probe for pointer/motion capabilities can mount.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

// jsdom lacks IntersectionObserver; provide a no-op stub.
if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
  class IntersectionObserverStub {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);
    root = null;
    rootMargin = '';
    thresholds = [];
  }
  const g = globalThis as unknown as { IntersectionObserver: unknown };
  g.IntersectionObserver = IntersectionObserverStub;
}

// jsdom does not implement canvas getContext and logs a noisy "Not implemented"
// error. Stub it to return null so WebGL detection degrades quietly in tests.
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = vi.fn(() => null) as never;
}
