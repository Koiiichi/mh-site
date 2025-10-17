'use client';

import { useEffect, useState, useRef } from 'react';
import { useTheme } from 'next-themes';

export function CursorHalo() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPointerDevice, setIsPointerDevice] = useState(false);
  const { theme } = useTheme();
  const rafId = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Check if the device has a fine pointer (mouse/trackpad)
    const hasPointer = window.matchMedia('(pointer: fine)').matches;
    setIsPointerDevice(hasPointer);

    // Don't add listeners on touch devices
    if (!hasPointer) return;

    const updateMousePosition = (e: MouseEvent) => {
      // Update position immediately without RAF for better responsiveness
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement;
      const interactiveElement = target?.closest('a, button, [role="button"], input, textarea, select');
      setIsHovering(!!interactiveElement);
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

  // Don't render on touch devices
  if (!isPointerDevice || !isVisible) return null;

  const isDark = theme === 'dark';

  return (
    <>
      {/* Halo effect that follows cursor site-wide */}
      <div
        className="pointer-events-none fixed z-40"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          width: isHovering ? 80 : 50,
          height: isHovering ? 80 : 50,
          transform: 'translate(-50%, -50%)',
          background: isDark 
            ? `radial-gradient(circle, rgba(107, 193, 255, ${isHovering ? '0.15' : '0.08'}) 0%, rgba(107, 193, 255, ${isHovering ? '0.08' : '0.04'}) 40%, transparent 70%)`
            : `radial-gradient(circle, rgba(15, 18, 22, ${isHovering ? '0.12' : '0.06'}) 0%, rgba(15, 18, 22, ${isHovering ? '0.06' : '0.03'}) 40%, transparent 70%)`,
          borderRadius: '50%',
          opacity: isHovering ? 0.9 : 0.7,
          mixBlendMode: isDark ? 'screen' : 'multiply',
          transition: isHovering ? 'width 0.15s ease-out, height 0.15s ease-out, opacity 0.15s ease-out' : 'width 0.15s ease-out, height 0.15s ease-out, opacity 0.15s ease-out',
        }}
      />
    </>
  );
}