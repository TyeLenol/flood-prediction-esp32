'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import { MagneticButton } from '../MagneticButton';

export function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // We will wait slightly for the preloader to finish (preloader is 1.2s max + animations)
      // So delay sequence by ~1.2s
      const delay = 1.2;

      gsap.set([subtitleRef.current, ctaRef.current, chevronRef.current], { 
        opacity: 0, 
        y: 20 
      });

      if (titleRef.current) {
        // Text masking: Wrap each word in an overflow-hidden mask
        const text = titleRef.current.innerText;
        titleRef.current.innerHTML = '';
        const words = text.split(' ');
        words.forEach((word, i) => {
          // The outer mask container
          const maskSpan = document.createElement('span');
          maskSpan.className = 'inline-block overflow-hidden pb-2 mr-3'; // padding-bottom prevents clipping tails
          
          // The inner moving text
          const innerSpan = document.createElement('span');
          innerSpan.className = 'inline-block translate-y-[100%]';
          innerSpan.innerText = word;

          maskSpan.appendChild(innerSpan);
          titleRef.current?.appendChild(maskSpan);
        });

        const wordSpans = titleRef.current.querySelectorAll('span > span');

        const tl = gsap.timeline({ delay });
        
        tl.to(wordSpans, {
          y: '0%',
          duration: 1,
          stagger: 0.1,
          ease: 'expo.out', // Snappy professional ease
        })
        .to(subtitleRef.current, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out'
        }, '-=0.6')
        .to(ctaRef.current, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out'
        }, '-=0.8')
        .to(chevronRef.current, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out'
        }, '-=0.8');
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-12 overflow-hidden">
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
          <MagneticButton>
            <Link 
              href="/dashboard" 
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-teal-500 hover:bg-teal-400 rounded-full transition-colors duration-300"
            >
              See it live
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </MagneticButton>
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
