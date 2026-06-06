interface BrandIconProps {
  /** Path to a monochrome SVG (served from /public). */
  src: string;
  size?: number;
  className?: string;
}

/**
 * Renders a monochrome SVG recolored to `currentColor` via CSS mask, so brand
 * marks follow the theme (no separate light/dark assets needed).
 */
export function BrandIcon({ src, size = 28, className }: BrandIconProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block bg-current ${className ?? ''}`}
      style={{
        width: size,
        height: size,
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
      }}
    />
  );
}
