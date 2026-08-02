'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

export function SignalThread() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (pathRef.current) {
        const length = pathRef.current.getTotalLength();
        
        // Setup initial stroke dash array and offset
        gsap.set(pathRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        // Draw the line down as the user scrolls
        gsap.to(pathRef.current, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
          }
        });
      }

      // Animate the signal dots flowing down continuously
      const dots = gsap.utils.toArray<SVGCircleElement>('.signal-dot');
      dots.forEach((dot, i) => {
        gsap.to(dot, {
          motionPath: {
            path: pathRef.current as SVGPathElement,
            align: pathRef.current as SVGPathElement,
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
          },
          duration: 15, // Slow loop
          repeat: -1,
          ease: 'none',
          delay: i * 5, // Stagger them
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-y-0 left-8 md:left-24 w-12 pointer-events-none z-0 mix-blend-multiply opacity-80">
      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 10 1000" fill="none">
        <path 
          ref={pathRef}
          d="M 5 0 L 5 1000" 
          stroke="url(#signalGradient)" 
          strokeWidth="1.5"
          className="drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]"
        />
        {/* Signal dots */}
        <circle className="signal-dot w-[3px] h-[3px] fill-teal-500 drop-shadow-[0_0_8px_rgba(15,118,110,0.8)]" r="1.5" cx="5" cy="0" />
        <circle className="signal-dot w-[3px] h-[3px] fill-cyan-500 drop-shadow-[0_0_8px_rgba(15,118,110,0.8)]" r="1.5" cx="5" cy="0" />
        
        <defs>
          <linearGradient id="signalGradient" x1="0" y1="0" x2="0" y2="1000" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f8fafc" stopOpacity="0" />
            <stop offset="0.1" stopColor="#2dd4bf" stopOpacity="0.8" />
            <stop offset="0.5" stopColor="#0ea5e9" stopOpacity="1" />
            <stop offset="0.9" stopColor="#2dd4bf" stopOpacity="0.8" />
            <stop offset="1" stopColor="#f8fafc" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
