'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';

export function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Setup initial states
      gsap.set([subtitleRef.current, ctaRef.current, chevronRef.current], { 
        opacity: 0, 
        y: 20 
      });

      if (titleRef.current) {
        // Split text manually for word-by-word animation (simple approach without SplitText plugin)
        const text = titleRef.current.innerText;
        titleRef.current.innerHTML = '';
        const words = text.split(' ');
        words.forEach((word, i) => {
          const span = document.createElement('span');
          span.className = 'inline-block opacity-0 translate-y-8';
          span.innerText = word + (i < words.length - 1 ? ' ' : '');
          titleRef.current?.appendChild(span);
        });

        const wordSpans = titleRef.current.querySelectorAll('span');

        const tl = gsap.timeline();
        
        tl.to(wordSpans, {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.1,
          ease: 'power2.out',
        })
        .to(subtitleRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: 'power2.out'
        }, '-=0.3')
        .to(ctaRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: 'power2.out'
        }, '-=0.4')
        .to(chevronRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: 'power2.out'
        }, '+=0.2');
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-12 overflow-hidden landing-glow">
      <div className="z-10 max-w-4xl mx-auto px-6 text-center">
        <h1 
          ref={titleRef}
          className="text-5xl sm:text-6xl md:text-7xl font-bold font-display tracking-tight text-white mb-6"
        >
          Flood prediction, done right.
        </h1>
        
        <p 
          ref={subtitleRef}
          className="text-lg sm:text-xl md:text-2xl text-slate-400 mb-10 max-w-2xl mx-auto"
        >
          Real-time IoT monitoring for Ghana&apos;s flood-prone communities.
        </p>

        <div ref={ctaRef} className="flex justify-center">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-teal-500 hover:bg-teal-400 rounded-full transition-colors duration-300"
          >
            See it live
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>

      <div 
        ref={chevronRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
      >
        <svg className="w-8 h-8 text-teal-500/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
