'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function BackgroundAtmosphere() {
  const blobsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Parallax effect for the background elements
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Tie the Y position of the blobs and grid to scroll, moving at 0.6x speed
      gsap.to([blobsRef.current, gridRef.current], {
        y: (i, target) => -ScrollTrigger.maxScroll(window) * 0.4, // Moves slower than scroll (parallax)
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-gradient-to-b from-[#050b14] to-[#0a1420]">
      
      {/* 1. Subtle Grid Pattern */}
      <div 
        ref={gridRef}
        className="absolute inset-0 w-full h-[200vh] opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* 2. Ambient Glow Blobs */}
      <div ref={blobsRef} className="absolute inset-0 w-full h-[200vh] will-change-transform">
        {/* Top Blob */}
        <div 
          className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-teal-500/20 blur-[120px] will-change-transform mix-blend-screen"
          style={{ animation: 'float-blob 18s ease-in-out infinite alternate' }}
        />
        {/* Middle-Right Blob */}
        <div 
          className="absolute top-[40%] right-[10%] w-[600px] h-[600px] rounded-full bg-cyan-600/15 blur-[120px] will-change-transform mix-blend-screen"
          style={{ animation: 'float-blob 22s ease-in-out infinite alternate-reverse' }}
        />
        {/* Bottom-Left Blob */}
        <div 
          className="absolute top-[75%] left-[5%] w-[450px] h-[450px] rounded-full bg-teal-600/15 blur-[120px] will-change-transform mix-blend-screen"
          style={{ animation: 'float-blob 15s ease-in-out infinite alternate' }}
        />
      </div>

      {/* 3. Grain Overlay (Fixed, NO PARALLAX) */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-blob {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -40px) scale(1.05); }
          100% { transform: translate(-20px, 30px) scale(0.95); }
        }
      `}} />
    </div>
  );
}
