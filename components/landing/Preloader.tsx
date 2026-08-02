'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);
  const ring3Ref = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const subTextRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    // Hard fallback to ensure preloader is destroyed after 1.5s max
    const fallbackTimeout = setTimeout(() => {
      setIsMounted(false);
    }, 1500);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsMounted(false);
      clearTimeout(fallbackTimeout);
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsMounted(false);
          clearTimeout(fallbackTimeout);
        }
      });

      gsap.set([ring1Ref.current, ring2Ref.current, ring3Ref.current], { opacity: 0, scale: 0.8 });
      gsap.set([textRef.current, subTextRef.current], { y: 20, opacity: 0 });

      tl.to([ring1Ref.current, ring2Ref.current, ring3Ref.current], {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)'
      })
      .to([ring1Ref.current, ring2Ref.current, ring3Ref.current], {
        rotation: 360,
        duration: 2,
        ease: 'none',
        repeat: 0
      }, 0)
      .to([textRef.current, subTextRef.current], {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.2
      }, "-=1.5")
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.4,
        delay: 0.2
      });

    }, containerRef);

    return () => {
      ctx.revert();
      clearTimeout(fallbackTimeout);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50 overflow-hidden"
    >
      {/* Glow behind the loading ring */}
      <div className="absolute w-[300px] h-[300px] bg-teal-400/20 blur-[60px] rounded-full mix-blend-multiply" />
      
      <div className="relative flex flex-col items-center justify-center">
        {/* Spinner rings */}
        <div className="relative w-24 h-24 mb-8">
          {/* Outer ring */}
          <div ref={ring1Ref} className="absolute inset-0 rounded-full border border-t-teal-500 border-r-teal-500 border-b-transparent border-l-transparent" />
          {/* Middle ring */}
          <div ref={ring2Ref} className="absolute inset-2 rounded-full border border-t-cyan-500 border-l-cyan-500 border-b-transparent border-r-transparent" />
          {/* Inner ring */}
          <div ref={ring3Ref} className="absolute inset-4 rounded-full border border-teal-300 border-b-teal-300 border-t-transparent border-r-transparent" />
          
          {/* Core dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-teal-500 rounded-full shadow-[0_0_10px_rgba(45,212,191,0.8)]" />
          </div>
        </div>

        {/* Text */}
        <div className="overflow-hidden">
          <div ref={textRef} className="text-xl font-display font-medium text-slate-900 tracking-wider">
            LEVEE
          </div>
        </div>
        <div className="overflow-hidden mt-2">
          <div ref={subTextRef} className="text-xs text-slate-500 tracking-[0.2em] uppercase">
            Initializing System
          </div>
        </div>
      </div>
    </div>
  );
}
