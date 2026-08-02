'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

export function SimulationSection() {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 px-6 bg-transparent relative z-10">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <div className="text-center mb-16 max-w-3xl">
          <h2 className="text-3xl font-display font-medium text-slate-900 mb-4">
            Test the architecture yourself.
          </h2>
          <p className="text-slate-600">
            We built Levee to be fully open. Explore the exact breadboard wiring and ESP32 components we use in this interactive Cirkit simulation.
          </p>
        </div>

        <div className="relative w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9]">
          
          {/* Fallback/Loader overlay before iframe loads */}
          {!iframeLoaded && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-100 rounded-2xl border border-slate-200">
              <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mb-4 text-white shadow-lg animate-pulse">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-slate-700 font-medium text-lg px-6 py-2 bg-white/60 rounded-full border border-slate-200">
                Loading Simulator...
              </span>
            </div>
          )}

          {/* Iframe wrapper with Glassmorphic bezel */}
          <div className="relative h-full rounded-2xl overflow-hidden border border-slate-300 bg-white/60 backdrop-blur-md shadow-2xl shadow-slate-300/80 flex flex-col -rotate-1 hover:-rotate-0 transition-transform duration-500">
            
            {/* Top UI Header bar */}
            <div className="flex items-center px-4 py-3 border-b border-slate-200 bg-slate-100/60 backdrop-blur-md shrink-0">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="mx-auto flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                <span className="text-xs font-semibold tracking-wider text-teal-700">LIVE SIMULATION</span>
              </div>
            </div>

            {/* Iframe container */}
            <div className="relative flex-grow w-full bg-white">
              <iframe 
                src="https://app.cirkitdesigner.com/project/015e1989-9bc9-4fae-a0c5-0013a998343f?view=interactive_preview" 
                title="Cirkit Designer Simulation"
                className="absolute inset-0 w-full h-full border-none"
                onLoad={() => setIframeLoaded(true)}
              />
              {/* Inner Vignette Shadow Overlay (pointer-events-none so iframe is clickable) */}
              <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] z-10 mix-blend-multiply"></div>
            </div>

          </div>
        </div>
        
        <p className="mt-6 text-sm text-slate-500 max-w-2xl text-center">
          Edit this project interactively in <a href="https://app.cirkitdesigner.com/project/015e1989-9bc9-4fae-a0c5-0013a998343f" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-500 underline">Cirkit Designer</a>.
        </p>

      </div>
    </section>
  );
}
