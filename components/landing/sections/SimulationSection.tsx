'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

export function SimulationSection() {
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 px-6 bg-[#050b14] relative z-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-medium text-white mb-4">
            Explore the live circuit
          </h2>
          <p className="text-slate-400">
            Tap the interactive schematic to explore the wiring and components.
          </p>
        </div>

        <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl">
          {/* Overlay to intercept clicks until user is ready to interact */}
          {!isActive && (
            <div 
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm cursor-pointer transition-opacity hover:bg-black/40"
              onClick={() => setIsActive(true)}
            >
              <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mb-4 text-white shadow-lg animate-pulse">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <span className="text-white font-medium text-lg px-6 py-2 bg-black/40 rounded-full">
                Tap to explore simulation
              </span>
            </div>
          )}

          <div className="relative mx-auto max-w-5xl">
            {/* Glassmorphic Container Bezel */}
            <div className="relative rounded-2xl overflow-hidden border border-teal-500/30 bg-[#0a1420]/60 backdrop-blur-md shadow-2xl shadow-black/80">
              
              {/* Header Bar */}
              <div className="flex items-center px-4 py-3 border-b border-teal-500/15 bg-black/40 backdrop-blur-md">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                </div>
                <div className="flex-1 flex justify-center items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.8)]"></div>
                  <span className="text-xs font-semibold tracking-wider text-teal-400/80">LIVE SIMULATION</span>
                </div>
              </div>

              {/* Iframe Wrapper */}
              <div className="relative w-full" style={{ paddingTop: 'calc(max(56.25%, 400px))' }}>
                <iframe 
                  src="https://app.cirkitdesigner.com/project/015e1989-9bc9-4fae-a0c5-0013a998343f?view=interactive_preview" 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  title="Cirkit Designer Simulation"
                />
                {/* Inner Vignette Shadow Overlay (pointer-events-none so iframe is clickable) */}
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] mix-blend-multiply" />
              </div>
            </div>
            
            <div className="mt-6 text-center text-sm text-slate-500">
              <p>
                Edit this project interactively in <a href="https://app.cirkitdesigner.com/project/015e1989-9bc9-4fae-a0c5-0013a998343f" target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:text-teal-400 underline">Cirkit Designer</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
