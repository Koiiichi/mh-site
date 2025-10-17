'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';

type TechIconProps = {
  src: string;
  alt?: string;
  size?: number;
  className?: string;
};

// Icons that have dedicated white versions for dark mode
const ICONS_WITH_WHITE_VERSIONS = [
  'python',
  'typer',
  'selenium',
  'openai',
  'react',
  'nextjs',
  'fastapi',
  'deepseek',
  'openseadragon',
  'vercel',
  'typescript',
  'tailwind',
  'firebase',
  'midi',
  'music'
];

export function TechIcon({ src, alt = '', size = 12, className = '' }: TechIconProps) {
  const [hasError, setHasError] = useState(false);
  const { resolvedTheme } = useTheme();
  
  // Determine if we should use the white version
  let iconSrc = src;
  if (resolvedTheme === 'dark') {
    const needsWhiteVersion = ICONS_WITH_WHITE_VERSIONS.some(icon => 
      src.includes(`/${icon}.svg`) || src.includes(`/${icon}-white.svg`)
    );
    
    if (needsWhiteVersion && !src.includes('-white.svg')) {
      iconSrc = src.replace(/\.svg$/, '-white.svg');
    }
  }

  if (hasError) {
    return null;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={iconSrc}
      alt={alt}
      width={size}
      height={size}
      className={`tech-icon ${className}`}
      aria-hidden="true"
      onError={() => setHasError(true)}
    />
  );
}
