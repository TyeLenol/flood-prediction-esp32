'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
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

      // Initial state: logo invisible and slightly scaled down
      gsap.set(logoRef.current, { opacity: 0, scale: 0.8 });

      tl.to(logoRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'back.out(1.5)'
      })
      .to(logoRef.current, {
        opacity: 0,
        scale: 1.1,
        duration: 0.3,
        ease: 'power2.in',
        delay: 0.2
      })
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut'
      }, '-=0.1');

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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050b14]"
    >
      <div ref={logoRef} className="flex flex-col items-center">
        {/* Simplified Levee Droplet Logo for Preloader */}
        <svg className="w-16 h-16 text-teal-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      </div>
    </div>
  );
}
