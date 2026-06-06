'use client';

import dynamic from 'next/dynamic';

/**
 * Lazy boundary for the particle sphere. `ssr: false` keeps three.js out of the
 * server-rendered HTML and splits it into its own async chunk loaded after
 * hydration, so it never blocks first paint. The layout (a server component)
 * renders this client wrapper.
 */
export const ParticleSphereLazy = dynamic(
  () => import('./particle-sphere').then((m) => m.ParticleSphere),
  { ssr: false },
);
