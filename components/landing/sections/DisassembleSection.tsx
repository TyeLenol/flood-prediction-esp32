'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const COMPONENTS = [
  {
    id: 'back',
    label: 'Back Plate',
    desc: 'Weather-sealed ABS enclosure mounting.',
    file: 'part_back.svg',
    tx: '-150%',
    ty: '-150%',
    w: '400px' // Scaled up
  },
  {
    id: 'antenna',
    label: 'LTE Antenna',
    desc: 'High-gain cellular telemetry.',
    file: 'part_antenna.svg',
    tx: '150%',
    ty: '-150%',
    w: '400px' // Scaled up
  },
  {
    id: 'pcb',
    label: 'Core Logic & Sensors',
    desc: 'ESP32 brains + JSN-SR04T ultrasonic interface.',
    file: 'part_pcb.svg',
    tx: '-150%',
    ty: '150%',
    w: '400px' // Scaled up
  },
  {
    id: 'front',
    label: 'Front Cover',
    desc: 'Solar panel array integration.',
    file: 'part_front.svg',
    tx: '150%',
    ty: '150%',
    w: '400px' // Scaled up
  }
];

export function DisassembleSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return; 

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) return; 

      // Cursor tracking glow - Fixed absolute coords top-0 left-0
      const xTo = gsap.quickTo(cursorGlowRef.current, 'x', { duration: 0.4, ease: 'power3' });
      const yTo = gsap.quickTo(cursorGlowRef.current, 'y', { duration: 0.4, ease: 'power3' });
      const opacityTo = gsap.quickTo(cursorGlowRef.current, 'opacity', { duration: 0.2 });

      const handleMouseMove = (e: MouseEvent) => {
        const rect = pinRef.current?.getBoundingClientRect();
        if (!rect) return;
        const target = e.target as HTMLElement;
        const isHoveringPart = target.closest('.component-part') || target.closest('.assembled-core');

        xTo(e.clientX - rect.left);
        yTo(e.clientY - rect.top);
        opacityTo(isHoveringPart ? 1 : 0.4); 
      };

      pinRef.current?.addEventListener('mousemove', handleMouseMove);
      pinRef.current?.addEventListener('mouseleave', () => opacityTo(0));

      const assembledCore = document.querySelector('.assembled-core');
      const parts = gsap.utils.toArray<HTMLElement>('.component-part');
      const labels = gsap.utils.toArray<HTMLElement>('.component-label');

      gsap.to(assembledCore, {
        rotation: 3,
        duration: 4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: '+=3500', 
        }
      });

      tl.to(assembledCore, { opacity: 0, duration: 0.5, ease: 'power2.inOut' });
      tl.to(parts, { opacity: 1, duration: 0.1 });

      parts.forEach((part, i) => {
        const tx = parseFloat(part.dataset.tx || '0');
        const ty = parseFloat(part.dataset.ty || '0');

        tl.to(part, {
          x: tx,
          y: ty,
          duration: 1.5,
          ease: 'expo.out',
        }, 0.5 + (i * 0.1)); 
      });

      labels.forEach((label, i) => {
        tl.to(label, {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out'
        }, 1.2 + (i * 0.1));
      });

      tl.to({}, { duration: 2 }); 

      tl.to(labels, { opacity: 0, duration: 0.5, ease: 'power2.inOut' });

      tl.to(parts, {
        x: '-50%',
        y: '-50%',
        duration: 1.5,
        ease: 'back.inOut(1.2)'
      });

      tl.to(parts, { opacity: 0, duration: 0.1 })
        .to(assembledCore, { opacity: 1, duration: 0.5, ease: 'power2.inOut' }, '-=0.1')
        .to(assembledCore, { scale: 1.05, duration: 0.4, ease: 'power2.out' })
        .to(assembledCore, { scale: 1, duration: 0.4, ease: 'power2.in' });

      return () => {
        pinRef.current?.removeEventListener('mousemove', handleMouseMove);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleMouseEnterCard = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, { scale: 1.05, ease: 'elastic.out(1, 0.6)', duration: 0.8 });
  };
  const handleMouseLeaveCard = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, { scale: 1, ease: 'elastic.out(1, 0.6)', duration: 0.8 });
  };

  return (
    <section id="disassemble" ref={containerRef} className="bg-transparent relative z-20">
      
      {/* DESKTOP LAYOUT (Pinned Animation) */}
      <div
        ref={pinRef}
        className="hidden md:flex min-h-screen w-full items-center justify-center overflow-hidden relative cursor-crosshair"
      >
        {/* Cursor Glow */}
        <div
          ref={cursorGlowRef}
          className="pointer-events-none absolute top-0 left-0 w-[400px] h-[400px] -ml-[200px] -mt-[200px] rounded-full bg-teal-500/20 blur-[100px] opacity-0 z-0 will-change-transform"
        />

        <div className="text-center absolute top-12 left-0 right-0 z-50 pointer-events-none">
          <h2 className="text-3xl font-display font-medium text-slate-900 mb-2">How it works</h2>
          <p className="text-slate-600">Scroll to explore the hardware architecture</p>
        </div>

        {/* The canvas area */}
        <div className="relative w-full max-w-5xl aspect-square flex items-center justify-center z-10">

          <img
            src="/landing/svgs/assembled_core.svg"
            alt="Assembled System"
            className="assembled-core absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] z-10 pointer-events-auto cursor-pointer"
            onMouseEnter={handleMouseEnterCard}
            onMouseLeave={handleMouseLeaveCard}
          />

          {COMPONENTS.map((comp) => (
            <div
              key={comp.id}
              className="component-part absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center opacity-0 pointer-events-auto cursor-pointer"
              style={{ width: comp.w }}
              data-tx={comp.tx}
              data-ty={comp.ty}
              onMouseEnter={handleMouseEnterCard}
              onMouseLeave={handleMouseLeaveCard}
            >
              <img
                src={`/landing/svgs/${comp.file}`}
                alt={comp.label}
                className="w-full h-auto drop-shadow-2xl pointer-events-none"
                aria-hidden="true"
              />
              <div className="component-label absolute top-[110%] w-auto whitespace-nowrap px-4 py-2 text-center opacity-0 bg-white/80 backdrop-blur-md border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 pointer-events-none">
                <div className="text-[12px] font-bold text-teal-600 uppercase tracking-wider mb-1">{comp.label}</div>
                <div className="text-[11px] text-slate-600 leading-tight">{comp.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MOBILE LAYOUT */}
      <div className="md:hidden py-24 px-6 flex flex-col items-center relative z-10">
        <h2 className="text-3xl font-display font-medium text-slate-900 mb-12 text-center">How it works</h2>
        
        <img 
          src="/landing/svgs/assembled_core.svg" 
          alt="Assembled System" 
          className="w-full max-w-[280px] mb-16 animate-[spin_20s_linear_infinite]"
        />

        <div className="w-full space-y-8">
          {COMPONENTS.map((comp) => (
            <div key={`mobile-${comp.id}`} className="flex items-center gap-6 bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-slate-200 shadow-xl shadow-slate-200/50">
              <div className="w-20 shrink-0 flex items-center justify-center">
                <img 
                  src={`/landing/svgs/${comp.file}`} 
                  alt={comp.label} 
                  className="w-full h-auto drop-shadow-md"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h3 className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-1">{comp.label}</h3>
                <p className="text-sm text-slate-600">{comp.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
