'use client';

import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function RadioStatic() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    let animationId: number;
    
    const drawStatic = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      // Generate random static
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;     // R
        data[i + 1] = value; // G
        data[i + 2] = value; // B
        data[i + 3] = Math.random() * 25; // Very low alpha for subtlety
      }

      ctx.putImageData(imageData, 0, 0);
      animationId = requestAnimationFrame(drawStatic);
    };

    drawStatic();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', updateSize);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-inherit"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-[0.015] mix-blend-overlay"
        style={{ imageRendering: 'pixelated' }}
      />
    </motion.div>
  );
}
