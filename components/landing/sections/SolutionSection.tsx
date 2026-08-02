'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function SolutionSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const leveeRef = useRef<HTMLHeadingElement>(null);
  const imgWrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Pin length: We need enough scroll to read, reveal device, fade text out, center device, hold.
      // Decrease end from +=1500 to +=1000 and tighten final hold.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          pin: true,
          end: '+=1000',
          scrub: 1,
        }
      });

      // Initial state
      gsap.set(textRef.current, { opacity: 0, y: 30 });
      gsap.set(leveeRef.current, { opacity: 0, scale: 0.8, y: 40 });
      
      // Image wrapper starts offset to the right, image scaled down slightly
      gsap.set(imgWrapperRef.current, { x: '15vw' });
      gsap.set(imgRef.current, { opacity: 0, scale: 0.7, y: 50 });
      gsap.set(glowRef.current, { opacity: 0, scale: 0.5 });

      tl.to(textRef.current, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })
        .to({}, { duration: 0.2 }) // Shortened Hold
        .to(leveeRef.current, { opacity: 1, scale: 1, y: 0, duration: 1.5, ease: 'back.out(1.5)' })
        .to({}, { duration: 0.2 }) // Shortened Hold
        .to(imgRef.current, { opacity: 1, scale: 1.2, y: 0, duration: 1.5, ease: 'expo.out' }) // Device appears on right
        .to({}, { duration: 1.0 }) // Reading hold
        // The Hero Glamour Moment
        .to(textContainerRef.current, { opacity: 0, x: -50, duration: 1, ease: 'power2.inOut' }, 'glamour')
        .to(imgWrapperRef.current, { x: '0vw', duration: 1.5, ease: 'power2.inOut' }, 'glamour') // Center it
        .to(imgRef.current, { scale: 2, duration: 1.5, ease: 'power2.inOut' }, 'glamour') // Enlarge it
        .to(glowRef.current, { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.inOut' }, 'glamour') // Intense glow behind
        .to({}, { duration: 0.5 }); // Final hold before unpinning to Disassemble section (SLASHED from 2 to 0.5)

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="h-screen w-full relative z-10 flex items-center overflow-hidden bg-transparent">
      
      {/* Asymmetric Text Block (Left Third) */}
      <div ref={textContainerRef} className="w-full md:w-1/3 px-6 md:pl-20 z-20 flex flex-col justify-center">
        <h2 ref={textRef} className="text-3xl md:text-4xl text-slate-600 font-light mb-4">
          But we have a solution...
        </h2>
        <h1 
          ref={leveeRef}
          className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-white tracking-[-0.04em] inline-block bg-teal-600 px-8 py-2 rounded-3xl -rotate-3 mt-4 shadow-xl shadow-teal-600/30 self-start"
        >
          Levee
        </h1>
      </div>

      {/* Assembled Core Device (Right-of-center initially, then absolutely centered) */}
      <div 
        ref={imgWrapperRef} 
        className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
      >
        <div ref={glowRef} className="absolute w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,_rgba(45,212,191,0.3)_0%,_transparent_70%)] blur-2xl" />
        <img 
          ref={imgRef}
          src="/landing/svgs/assembled_core.svg" 
          alt="Levee Device" 
          className="w-[300px] md:w-[400px] h-auto relative z-10 drop-shadow-2xl"
        />
      </div>

    </section>
  );
}
