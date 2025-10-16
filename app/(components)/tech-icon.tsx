'use client';

import Image from 'next/image';
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
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      onError={() => setHasError(true)}
    />
  );
}
