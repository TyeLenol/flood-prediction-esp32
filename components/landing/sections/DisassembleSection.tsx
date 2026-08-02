'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Map of components to their target positions (X, Y) and display widths
const COMPONENTS = [
  { id: 'outer_enclosure', file: 'outer_enclosure.svg', tx: 0, ty: -240, w: 120, label: 'Weatherproof enclosure', desc: 'Protects internals from harsh conditions' },
  { id: 'esp32_wroom', file: 'esp32_wroom.svg', tx: -200, ty: -200, w: 100, label: 'ESP32-WROOM-32', desc: 'Core controller & processing unit' },
  { id: 'hc_sr04_ultrasonic', file: 'hc_sr04_ultrasonic.svg', tx: -260, ty: -60, w: 105, label: 'HC-SR04 Ultrasonic', desc: 'Water level detection sensor' },
  { id: 'rain_sensor', file: 'rain_sensor.svg', tx: -240, ty: 100, w: 105, label: 'Rain sensor', desc: 'Surface rainfall detection' },
  { id: 'capacitive_soil_probe', file: 'capacitive_soil_probe.svg', tx: -90, ty: 240, w: 80, label: 'Capacitive probe', desc: 'Soil moisture saturation' },
  { id: 'sim7600e_gsm_module', file: 'sim7600e_gsm_module.svg', tx: 90, ty: 240, w: 105, label: 'SIM7600E GSM', desc: 'Cellular data uplink' },
  { id: 'solar_panel', file: 'solar_panel.svg', tx: 240, ty: 100, w: 110, label: 'Solar panel', desc: 'Continuous renewable power' },
  { id: 'tp4056_charger', file: 'tp4056_charger.svg', tx: 260, ty: -60, w: 100, label: 'TP4056 Charger', desc: 'Battery management circuit' },
  { id: 'li_ion_18650_battery', file: 'li_ion_18650_battery.svg', tx: 200, ty: -200, w: 85, label: 'Li-ion 18650', desc: 'Rechargeable battery' },
  { id: 'status_leds', file: 'status_leds.svg', tx: -80, ty: -250, w: 90, label: 'Status LEDs', desc: 'Local visual alerts' },
  { id: 'active_buzzer', file: 'active_buzzer.svg', tx: 80, ty: -250, w: 65, label: 'Active buzzer', desc: 'Local audible alarm' },
  { id: 'spdt_switch', file: 'spdt_switch.svg', tx: 0, ty: 280, w: 65, label: 'SPDT switch', desc: 'Hardware power control' },
];

export function DisassembleSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return; // Skip complex animation, let CSS handle static layout

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) return; // Skip pinning on mobile, rely on static CSS layout

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: '+=3500', // 3500px of scroll distance
        }
      });

      const assembledCore = document.querySelector('.assembled-core');
      const parts = gsap.utils.toArray<HTMLElement>('.component-part');
      const labels = gsap.utils.toArray<HTMLElement>('.component-label');

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
          ease: 'power2.out',
        }, 0.5 + (i * 0.1)); // Stagger start times
      });

      // Phase 4: Fade in labels (staggered slightly after their component starts moving)
      labels.forEach((label, i) => {
        tl.to(label, {
          opacity: 1,
          duration: 0.5,
          ease: 'power1.inOut'
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
        ease: 'power3.inOut'
      });

      // Phase 8: assembled core fades back in & pulses
      tl.to(parts, { opacity: 0, duration: 0.1 })
        .to(assembledCore, { opacity: 1, duration: 0.5, ease: 'power2.inOut' }, '-=0.1')
        .to(assembledCore, { scale: 1.05, duration: 0.4, ease: 'power2.out' })
        .to(assembledCore, { scale: 1, duration: 0.4, ease: 'power2.in' });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="disassemble" ref={containerRef} className="bg-[#050b14] relative z-20">
      {/* 
        DESKTOP LAYOUT (Pinned Animation) 
        hidden on mobile, visible on md+
      */}
      <div 
        ref={pinRef} 
        className="hidden md:flex min-h-screen w-full items-center justify-center overflow-hidden relative"
      >
        <div className="text-center absolute top-12 left-0 right-0 z-50">
          <h2 className="text-3xl font-display font-medium text-white mb-2">How it works</h2>
          <p className="text-slate-400">Scroll to explore the hardware architecture</p>
        </div>

        {/* The canvas area */}
        <div className="relative w-full max-w-4xl aspect-square flex items-center justify-center">
          
          {/* Assembled Core (Base) */}
          <img 
            src="/landing/svgs/assembled_core.svg" 
            alt="Assembled System"
            className="assembled-core absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] z-10"
          />

          {/* Individual Components */}
          {COMPONENTS.map((comp) => (
            <div 
              key={comp.id}
              className="component-part absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center opacity-0 pointer-events-none"
              style={{ width: comp.w }}
              data-tx={comp.tx}
              data-ty={comp.ty}
            >
              <img 
                src={`/landing/svgs/${comp.file}`} 
                alt={comp.label}
                className="w-full h-auto drop-shadow-xl"
                aria-hidden="true"
              />
              {/* Label overlay attached to component */}
              <div className="component-label absolute top-[110%] w-[160px] text-center opacity-0">
                <div className="text-[11px] font-bold text-teal-400 uppercase tracking-wider mb-1">{comp.label}</div>
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
      <div className="md:hidden py-24 px-6 flex flex-col items-center">
        <h2 className="text-3xl font-display font-medium text-white mb-12 text-center">How it works</h2>
        
        <img 
          src="/landing/svgs/assembled_core.svg" 
          alt="Assembled System"
          className="w-full max-w-[240px] mb-16"
        />

        <div className="w-full space-y-8">
          {COMPONENTS.map((comp) => (
            <div key={`mobile-${comp.id}`} className="flex items-center gap-6 bg-white/5 rounded-2xl p-4 border border-white/10">
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
