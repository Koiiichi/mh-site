'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  angle: number;
}

export function HeroBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
    
    // Generate particles
    const newParticles: Particle[] = [];
    const particleCount = prefersReducedMotion ? 8 : 20;
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.3 + 0.1,
        speed: Math.random() * 0.5 + 0.1,
        angle: Math.random() * Math.PI * 2
      });
    }
    
    setParticles(newParticles);
  }, [prefersReducedMotion]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />
      
      {/* Noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Geometric shapes */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600">
        <defs>
          <linearGradient id="shapeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--acc1)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="var(--acc2)" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        
        {/* Large geometric shapes */}
        <motion.polygon
          points="100,50 200,100 150,200 50,150"
          fill="url(#shapeGradient)"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: prefersReducedMotion ? 0.3 : [0.2, 0.4, 0.2],
            scale: prefersReducedMotion ? 1 : [0.8, 1.1, 0.8],
            rotate: prefersReducedMotion ? 0 : [0, 5, 0]
          }}
          transition={{ 
            duration: prefersReducedMotion ? 0 : 8,
            repeat: prefersReducedMotion ? 0 : Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.circle
          cx="800"
          cy="150"
          r="80"
          fill="url(#shapeGradient)"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: prefersReducedMotion ? 0.2 : [0.1, 0.3, 0.1],
            scale: prefersReducedMotion ? 1 : [0.5, 1.2, 0.5]
          }}
          transition={{ 
            duration: prefersReducedMotion ? 0 : 12,
            repeat: prefersReducedMotion ? 0 : Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        <motion.rect
          x="700"
          y="400"
          width="120"
          height="120"
          fill="url(#shapeGradient)"
          rx="20"
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ 
            opacity: prefersReducedMotion ? 0.15 : [0.1, 0.25, 0.1],
            rotate: prefersReducedMotion ? 15 : [0, 25, 0]
          }}
          transition={{ 
            duration: prefersReducedMotion ? 0 : 10,
            repeat: prefersReducedMotion ? 0 : Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </svg>

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-accent-1"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
          }}
          animate={prefersReducedMotion ? {} : {
            x: [0, Math.cos(particle.angle) * 20, 0],
            y: [0, Math.sin(particle.angle) * 20, 0],
            opacity: [particle.opacity, particle.opacity * 0.3, particle.opacity],
          }}
          transition={{
            duration: 8 + particle.speed * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.id * 0.5,
          }}
        />
      ))}

      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(107, 193, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(107, 193, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}
