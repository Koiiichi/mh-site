'use client';

import { useEffect, useState, useRef } from 'react';
import { useTheme } from 'next-themes';

export function CursorHalo() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { theme } = useTheme();
  const rafId = useRef<number | undefined>(undefined);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      
      rafId.current = requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
        if (!isVisible) setIsVisible(true);

        // Check if hovering over interactive elements
        const target = e.target as HTMLElement;
        const interactiveElement = target?.closest('a, button, [role="button"], input, textarea, select');
        setIsHovering(!!interactiveElement);
      });
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsHovering(false);
    };

    document.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const isDark = theme === 'dark';

  return (
    <>
      {/* Subtle halo effect that follows cursor site-wide */}
      <div
        className="pointer-events-none fixed z-40 transition-all duration-200 ease-out"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          width: isHovering ? 60 : 40,
          height: isHovering ? 60 : 40,
          transform: 'translate(-50%, -50%)',
          background: isDark 
            ? `radial-gradient(circle, rgba(107, 193, 255, ${isHovering ? '0.08' : '0.04'}) 0%, rgba(107, 193, 255, ${isHovering ? '0.04' : '0.02'}) 40%, transparent 70%)`
            : `radial-gradient(circle, rgba(15, 18, 22, ${isHovering ? '0.06' : '0.03'}) 0%, rgba(15, 18, 22, ${isHovering ? '0.03' : '0.015'}) 40%, transparent 70%)`,
          borderRadius: '50%',
          opacity: isHovering ? 0.7 : 0.5,
          mixBlendMode: isDark ? 'screen' : 'multiply',
        }}
      />
    </>
  );
}