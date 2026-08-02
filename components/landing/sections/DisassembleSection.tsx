'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Map of components to their target positions (X, Y) and display widths
// Scaled widths ~2x per Priority 2
const COMPONENTS = [
  { id: 'outer_enclosure', file: 'outer_enclosure.svg', tx: 0, ty: -240, w: 240, label: 'Weatherproof enclosure', desc: 'Protects internals from harsh conditions' },
  { id: 'esp32_wroom', file: 'esp32_wroom.svg', tx: -200, ty: -200, w: 200, label: 'ESP32-WROOM-32', desc: 'Core controller & processing unit' },
  { id: 'hc_sr04_ultrasonic', file: 'hc_sr04_ultrasonic.svg', tx: -260, ty: -60, w: 210, label: 'HC-SR04 Ultrasonic', desc: 'Water level detection sensor' },
  { id: 'rain_sensor', file: 'rain_sensor.svg', tx: -240, ty: 100, w: 210, label: 'Rain sensor', desc: 'Surface rainfall detection' },
  { id: 'capacitive_soil_probe', file: 'capacitive_soil_probe.svg', tx: -90, ty: 240, w: 160, label: 'Capacitive probe', desc: 'Soil moisture saturation' },
  { id: 'sim7600e_gsm_module', file: 'sim7600e_gsm_module.svg', tx: 90, ty: 240, w: 210, label: 'SIM7600E GSM', desc: 'Cellular data uplink' },
  { id: 'solar_panel', file: 'solar_panel.svg', tx: 240, ty: 100, w: 220, label: 'Solar panel', desc: 'Continuous renewable power' },
  { id: 'tp4056_charger', file: 'tp4056_charger.svg', tx: 260, ty: -60, w: 200, label: 'TP4056 Charger', desc: 'Battery management circuit' },
  { id: 'li_ion_18650_battery', file: 'li_ion_18650_battery.svg', tx: 200, ty: -200, w: 170, label: 'Li-ion 18650', desc: 'Rechargeable battery' },
  { id: 'status_leds', file: 'status_leds.svg', tx: -80, ty: -250, w: 180, label: 'Status LEDs', desc: 'Local visual alerts' },
  { id: 'active_buzzer', file: 'active_buzzer.svg', tx: 80, ty: -250, w: 130, label: 'Active buzzer', desc: 'Local audible alarm' },
  { id: 'spdt_switch', file: 'spdt_switch.svg', tx: 0, ty: 280, w: 130, label: 'SPDT switch', desc: 'Hardware power control' },
];

export function DisassembleSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return; // Skip complex animation, let CSS handle static layout

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) return; // Skip pinning on mobile, rely on static CSS layout

      // Cursor tracking glow
      const xTo = gsap.quickTo(cursorGlowRef.current, 'x', { duration: 0.4, ease: 'power3' });
      const yTo = gsap.quickTo(cursorGlowRef.current, 'y', { duration: 0.4, ease: 'power3' });
      const opacityTo = gsap.quickTo(cursorGlowRef.current, 'opacity', { duration: 0.2 });

      const handleMouseMove = (e: MouseEvent) => {
        const rect = pinRef.current?.getBoundingClientRect();
        if (!rect) return;
        // Check if mouse is hovering an interactive component (class 'component-part' or 'assembled-core')
        const target = e.target as HTMLElement;
        const isHoveringPart = target.closest('.component-part') || target.closest('.assembled-core');
        
        xTo(e.clientX - rect.left);
        yTo(e.clientY - rect.top);
        opacityTo(isHoveringPart ? 1 : 0.3); // Brighten on hover
      };

      pinRef.current?.addEventListener('mousemove', handleMouseMove);
      pinRef.current?.addEventListener('mouseleave', () => opacityTo(0));

      const assembledCore = document.querySelector('.assembled-core');
      const parts = gsap.utils.toArray<HTMLElement>('.component-part');
      const labels = gsap.utils.toArray<HTMLElement>('.component-label');

      // Add slow continuous rotation to assembled core
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
          end: '+=3500', // 3500px of scroll distance
        }
      });

      // Phase 1: Fade out assembled core
      tl.to(assembledCore, { opacity: 0, duration: 0.5, ease: 'power2.inOut' });

      // Phase 2: Fade in components at center
      tl.to(parts, { opacity: 1, duration: 0.1 });

      // Phase 3: Staggered flyout
      parts.forEach((part, i) => {
        const tx = parseFloat(part.dataset.tx || '0');
        const ty = parseFloat(part.dataset.ty || '0');
        
        tl.to(part, {
          x: tx,
          y: ty,
          duration: 1.5,
          ease: 'expo.out', 
        }, 0.5 + (i * 0.1)); // Stagger start times
      });

      // Phase 4: Fade in labels (staggered slightly after their component starts moving)
      labels.forEach((label, i) => {
        tl.to(label, {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out'
        }, 1.2 + (i * 0.1));
      });

      // Phase 5: Hold (empty space in timeline for scrolling without movement)
      tl.to({}, { duration: 2 }); // Pause for reading

      // Phase 6: Fade out labels
      tl.to(labels, { opacity: 0, duration: 0.5, ease: 'power2.inOut' });

      // Phase 7: Reassembly (all parts back to center simultaneously)
      tl.to(parts, {
        x: '-50%', // Back to default transform translate
        y: '-50%',
        duration: 1.5,
        ease: 'back.inOut(1.2)' 
      });

      // Phase 8: assembled core fades back in & pulses
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

  // Cursor interaction hover handler for scale
  const handleMouseEnterCard = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, { scale: 1.05, ease: 'elastic.out(1, 0.6)', duration: 0.8 });
  };
  const handleMouseLeaveCard = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, { scale: 1, ease: 'elastic.out(1, 0.6)', duration: 0.8 });
  };

  return (
    <section id="disassemble" ref={containerRef} className="bg-transparent relative z-20">
      {/* 
        DESKTOP LAYOUT (Pinned Animation) 
        hidden on mobile, visible on md+
      */}
      <div 
        ref={pinRef}
        className="hidden md:flex min-h-screen w-full items-center justify-center overflow-hidden relative cursor-crosshair"
      >
        {/* Cursor Glow */}
        <div 
          ref={cursorGlowRef}
          className="pointer-events-none absolute w-[300px] h-[300px] -ml-[150px] -mt-[150px] rounded-full bg-teal-500/20 blur-[60px] opacity-0 z-0 will-change-transform"
        />

        <div className="text-center absolute top-12 left-0 right-0 z-50 pointer-events-none">
          <h2 className="text-3xl font-display font-medium text-white mb-2">How it works</h2>
          <p className="text-slate-400">Scroll to explore the hardware architecture</p>
        </div>

        {/* The canvas area */}
        <div className="relative w-full max-w-5xl aspect-square flex items-center justify-center z-10">
          
          {/* Assembled Core (Base) */}
          <img 
            src="/landing/svgs/assembled_core.svg" 
            alt="Assembled System" 
            className="assembled-core absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] z-10 pointer-events-auto cursor-pointer"
            onMouseEnter={handleMouseEnterCard}
            onMouseLeave={handleMouseLeaveCard}
          />

          {/* Individual Components */}
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
              {/* Glassmorphic Label overlay attached to component */}
              <div className="component-label absolute top-[110%] w-auto whitespace-nowrap px-4 py-2 text-center opacity-0 bg-[#0a1420]/70 backdrop-blur-md border border-teal-500/20 rounded-xl shadow-xl shadow-black/50 pointer-events-none">
                <div className="text-[12px] font-bold text-teal-400 uppercase tracking-wider mb-1">{comp.label}</div>
                <div className="text-[11px] text-slate-300 leading-tight">{comp.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 
        MOBILE LAYOUT (Static Scroll List) 
        visible on mobile, hidden on md+
      */}
      <div className="md:hidden py-24 px-6 flex flex-col items-center relative z-10">
        <h2 className="text-3xl font-display font-medium text-white mb-12 text-center">How it works</h2>
        
        <img 
          src="/landing/svgs/assembled_core.svg" 
          alt="Assembled System" 
          className="w-full max-w-[280px] mb-16"
        />

        <div className="w-full space-y-8">
          {COMPONENTS.map((comp) => (
            <div key={`mobile-${comp.id}`} className="flex items-center gap-6 bg-[#0a1420]/60 backdrop-blur-md rounded-2xl p-4 border border-teal-500/20 shadow-xl shadow-black/50">
              <div className="w-20 shrink-0 flex items-center justify-center">
                <img 
                  src={`/landing/svgs/${comp.file}`} 
                  alt={comp.label} 
                  className="w-full h-auto drop-shadow-md"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h3 className="text-sm font-bold text-teal-400 uppercase tracking-wider mb-1">{comp.label}</h3>
                <p className="text-sm text-slate-300">{comp.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
