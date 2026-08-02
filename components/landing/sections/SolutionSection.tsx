'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function SolutionSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const leveeRef = useRef<HTMLHeadingElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top', // Start pinning when it hits the top
          pin: true,
          end: '+=800', // Pin for 800px of scroll
          scrub: 1, // Tie it to scroll scrub rather than play-once for better pinned feel
        }
      });

      tl.fromTo(textRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
      )
      .to({}, { duration: 0.5 }) // Brief pause for reading
      .fromTo(leveeRef.current,
        { opacity: 0, scale: 0.8, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 1.5, ease: 'back.out(1.5)' }
      )
      .to({}, { duration: 0.5 }) // Brief pause
      .fromTo(imgRef.current,
        { opacity: 0, scale: 0.7, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 1.5, ease: 'expo.out' }
      )
      .to({}, { duration: 1 }); // Hold at the end before unpinning
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 px-6 bg-[#050b14] flex flex-col items-center justify-center min-h-[80vh] relative z-10 text-center">
      <h2 ref={textRef} className="text-2xl md:text-3xl text-slate-400 font-light mb-4">
        But we have a solution.
      </h2>
      
      <h1 ref={leveeRef} className="text-7xl md:text-9xl font-display font-bold tracking-tighter mb-16 bg-gradient-to-br from-teal-300 via-teal-500 to-teal-700 bg-clip-text text-transparent pb-4">
        Levee
      </h1>

      <div className="relative w-full max-w-sm mx-auto aspect-square flex items-center justify-center">
        {/* Decorative background glow behind the core */}
        <div className="absolute inset-0 bg-teal-500/10 blur-[100px] rounded-full" />
        
        <img 
          ref={imgRef}
          src="/landing/svgs/assembled_core.svg" 
          alt="Levee assembled core" 
          className="w-full h-auto relative z-10 object-contain drop-shadow-2xl"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
