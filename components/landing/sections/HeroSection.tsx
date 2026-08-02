'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import { MagneticButton } from '../MagneticButton';

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const delay = 0.5;

      const tl = gsap.timeline({ delay });

      tl.fromTo('.hero-word', 
        { y: '100%' }, 
        { y: '0%', duration: 1, stagger: 0.05, ease: 'expo.out' }
      )
      .fromTo([badgeRef.current, ctaRef.current, scrollIndicatorRef.current],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 },
        '-=0.5'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-32 px-6 z-10 overflow-hidden">
      
      {/* Background glow specific to hero */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,_rgba(45,212,191,0.15)_0%,_transparent_60%)] blur-3xl pointer-events-none mix-blend-multiply" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        {/* Eyebrow */}
        <div ref={badgeRef} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 text-sm font-medium mb-8 -rotate-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
          </span>
          Early Warning System
        </div>

        {/* Main Headline with Masking for GSAP */}
        <h1 
          ref={titleRef}
          className="text-5xl sm:text-6xl md:text-7xl font-bold font-display tracking-[-0.04em] text-slate-900 mb-6"
        >
          <span className="hero-word-wrapper inline-block overflow-hidden pb-2 -mb-2">
            <span className="hero-word inline-block">Predict.</span>
          </span>{' '}
          <span className="hero-word-wrapper inline-block overflow-hidden pb-2 -mb-2">
            <span className="hero-word inline-block">Prepare.</span>
          </span>{' '}
          <span className="hero-word-wrapper inline-block overflow-hidden pb-2 -mb-2 text-teal-600">
            <span className="hero-word inline-block">Protect.</span>
          </span>
        </h1>

        {/* Subheadline with Masking */}
        <p ref={subtitleRef} className="text-lg sm:text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto">
          <span className="hero-word-wrapper block overflow-hidden pb-2 -mb-2">
            <span className="hero-word inline-block">Advanced flood prediction powered by ESP32,</span>
          </span>
          <span className="hero-word-wrapper block overflow-hidden pb-2 -mb-2">
            <span className="hero-word inline-block">ultrasonic sensors, and real-time cellular data.</span>
          </span>
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <MagneticButton>
            <Link 
              href="/dashboard" 
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-teal-600 hover:bg-teal-500 rounded-full transition-colors duration-300 shadow-lg shadow-teal-500/30"
            >
              Enter Dashboard
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </MagneticButton>
        </div>
      </div>

      {/* Scroll indicator */}
      <div 
        ref={scrollIndicatorRef}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
      >
        <span className="text-xs uppercase tracking-widest font-medium">Scroll to explore</span>
        <svg className="w-8 h-8 text-teal-600/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
