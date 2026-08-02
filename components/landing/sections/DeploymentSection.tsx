'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Dynamically import the map component with SSR disabled
const GhanaMap = dynamic(() => import('../GhanaMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[480px] rounded-2xl bg-white/5 border border-white/10 animate-pulse flex items-center justify-center text-slate-500">
      Loading map...
    </div>
  ),
});

export function DeploymentSection() {
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
    <section ref={containerRef} className="py-24 px-6 bg-slate-50 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-slate-700 leading-tight mb-16">
          Deployed at the right spots, <strong className="text-teal-600 font-medium">Levee</strong> can help prevent losses like these.
        </h2>

        <div className="mx-auto w-full max-w-3xl drop-shadow-2xl">
          <GhanaMap />
        </div>
      </div>
    </section>
  );
}
