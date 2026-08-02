'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function BackgroundAtmosphere() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Gentle floating animation for the glowing orbs
      gsap.to('.glow-blob-1', {
        y: '-=100',
        x: '+=50',
        duration: 8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      gsap.to('.glow-blob-2', {
        y: '+=120',
        x: '-=60',
        duration: 10,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: -2,
      });

      gsap.to('.glow-blob-3', {
        y: '-=80',
        scale: 1.1,
        duration: 12,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: -5,
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 bg-slate-50 overflow-hidden">
      
      {/* 1. Subtle Noise/Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: 'url("/landing/noise.png")', backgroundRepeat: 'repeat' }}></div>

      {/* 2. Abstract Glowing Orbs (Volumetric Light) */}
      <div className="glow-blob-1 absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-teal-200/40 blur-[120px] will-change-transform mix-blend-multiply" />
      <div className="glow-blob-2 absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-200/40 blur-[140px] will-change-transform mix-blend-multiply" />
      <div className="glow-blob-3 absolute top-[40%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-emerald-100/40 blur-[100px] will-change-transform mix-blend-multiply" />

      {/* 3. Tech Grid */}
      <div className="absolute inset-0 opacity-40 mix-blend-multiply" 
           style={{ 
             backgroundImage: 'linear-gradient(to right, rgba(148, 163, 184, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.1) 1px, transparent 1px)',
             backgroundSize: '4rem 4rem',
             maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)',
             WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)',
           }}
      />
    </div>
  );
}
