'use client';

import { useEffect, useState, useRef } from 'react';
import { useTheme } from 'next-themes';

export function CursorHalo() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [buttonDimensions, setButtonDimensions] = useState({ width: 0, height: 0, x: 0, y: 0 });
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
        const isInteractive = target?.closest('a, button, [role="button"], input, textarea, select') as HTMLElement;
        setIsHovering(!!isInteractive);
        
        if (isInteractive) {
          const rect = isInteractive.getBoundingClientRect();
          setButtonDimensions({
            width: rect.width,
            height: rect.height,
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
          });
        }
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
  const size = isHovering ? 8 : 12;
  const opacity = isHovering ? 0.8 : 1;

  return (
    <>
      {/* Main cursor circle */}
      <div
        className="pointer-events-none fixed z-50 transition-all duration-200 ease-out"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          width: size,
          height: size,
          transform: 'translate(-50%, -50%)',
          background: isDark ? 'rgba(107, 193, 255, 0.8)' : 'rgba(15, 18, 22, 0.8)',
          borderRadius: '50%',
          opacity,
          boxShadow: isDark 
            ? `0 0 ${size * 2}px rgba(107, 193, 255, 0.3)` 
            : `0 4px 12px rgba(15, 18, 22, 0.2)`,
        }}
      />
      
      {/* Button outline effect when hovering */}
      {isHovering && (
        <div
          className="pointer-events-none fixed z-40 transition-all duration-300 ease-out"
          style={{
            left: buttonDimensions.x,
            top: buttonDimensions.y,
            width: buttonDimensions.width + 8,
            height: buttonDimensions.height + 8,
            transform: 'translate(-50%, -50%)',
            border: `2px solid ${isDark ? 'rgba(107, 193, 255, 0.5)' : 'rgba(15, 18, 22, 0.5)'}`,
            borderRadius: '9999px',
            opacity: 0.6,
          }}
        />
      )}
      
      {/* Additional halo effect for dark mode */}
      {isDark && (
        <div
          className="pointer-events-none fixed z-40 transition-all duration-300 ease-out"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            width: size * 4,
            height: size * 4,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(107, 193, 255, 0.1) 0%, rgba(107, 193, 255, 0.05) 40%, transparent 70%)',
            borderRadius: '50%',
            opacity: isHovering ? 0.8 : 0.4,
            mixBlendMode: 'screen',
          }}
        />
      )}
    </>
  );
}