import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ParticleSphere } from './particle-sphere';

describe('ParticleSphere', () => {
  it('mounts and renders a canvas without throwing when WebGL is unavailable', () => {
    // jsdom has no WebGL context; the component must degrade gracefully.
    const { container, unmount } = render(<ParticleSphere />);
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();
    // Unmounting should run cleanup/dispose without error.
    expect(() => unmount()).not.toThrow();
  });
});
