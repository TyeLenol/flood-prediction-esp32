'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function ProblemSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const paragraphs = gsap.utils.toArray<HTMLParagraphElement>('.problem-text');
      const footnote = document.querySelector('.problem-footnote');

      paragraphs.forEach((p) => {
        gsap.fromTo(p, 
          { opacity: 0, y: 30 },
          {
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            ease: 'power2.out',
            scrollTrigger: {
              trigger: p,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      if (footnote) {
        gsap.fromTo(footnote,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: footnote,
              start: 'top 95%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-32 px-6 bg-[#050b14] relative z-10">
      <div className="max-w-3xl mx-auto space-y-16">
        <p className="problem-text text-3xl md:text-4xl lg:text-5xl font-light text-slate-300 leading-tight">
          Ghana loses an estimated <strong className="text-teal-400 font-medium">$200 million</strong> every year to flooding — over <strong className="text-teal-400 font-medium">$1.7 billion</strong> in the past decade alone.
        </p>

        <p className="problem-text text-3xl md:text-4xl lg:text-5xl font-light text-slate-300 leading-tight">
          More than <strong className="text-teal-400 font-medium">2 million people</strong> are affected annually.
        </p>

        <p className="problem-text text-3xl md:text-4xl lg:text-5xl font-light text-slate-300 leading-tight">
          In June 2015, a single flood disaster in Accra claimed over <strong className="text-teal-400 font-medium">150 lives</strong> in one night.
        </p>

        <p className="problem-footnote text-sm text-slate-500 pt-8 border-t border-white/5">
          (World Bank / MyJoyOnline estimates)
        </p>
      </div>
    </section>
  );
}
