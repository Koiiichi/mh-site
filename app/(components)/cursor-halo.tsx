'use client';

import { useEffect, useState } from 'react';

export function CursorHalo() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    document.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="pointer-events-none fixed z-50 transition-opacity duration-300"
      style={{
        left: mousePosition.x - 100,
        top: mousePosition.y - 100,
        width: 200,
        height: 200,
        background: 'radial-gradient(circle, rgba(107, 193, 255, 0.08) 0%, rgba(107, 193, 255, 0.02) 40%, transparent 70%)',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        mixBlendMode: 'screen',
      }}
    />
  );
}