'use client';

import { useState } from 'react';

type TechIconProps = {
  src: string;
  alt?: string;
  size?: number;
  className?: string;
};

export function TechIcon({ src, alt = '', size = 12, className = '' }: TechIconProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return null;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`tech-icon ${className}`}
      aria-hidden="true"
      onError={() => setHasError(true)}
    />
  );
}
