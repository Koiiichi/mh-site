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
      {/* Halo effect on hover */}
      {isHovering && (
        <div
          className="pointer-events-none fixed z-40 transition-all duration-300 ease-out"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            width: 80,
            height: 80,
            transform: 'translate(-50%, -50%)',
            background: isDark 
              ? 'radial-gradient(circle, rgba(107, 193, 255, 0.15) 0%, rgba(107, 193, 255, 0.08) 40%, transparent 70%)'
              : 'radial-gradient(circle, rgba(15, 18, 22, 0.1) 0%, rgba(15, 18, 22, 0.05) 40%, transparent 70%)',
            borderRadius: '50%',
            opacity: 0.8,
            mixBlendMode: isDark ? 'screen' : 'multiply',
          }}
        />
      )}
    </>
  );
}