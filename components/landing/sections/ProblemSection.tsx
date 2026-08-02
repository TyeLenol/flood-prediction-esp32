'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function ProblemSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const num1Ref = useRef<HTMLElement>(null);
  const num1WrapperRef = useRef<HTMLSpanElement>(null);
  const num2Ref = useRef<HTMLElement>(null);
  const num3Ref = useRef<HTMLElement>(null);
  const num4Ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLDivElement>('.problem-card');
      const footnote = document.querySelector('.problem-footnote');

      cards.forEach((card, i) => {
        if (prefersReducedMotion) {
          gsap.set(card, { opacity: 1, y: 0 });
        } else {
          gsap.fromTo(card, 
            { opacity: 0, y: 40 },
            {
              opacity: 1, 
              y: 0, 
              duration: 1.2, 
              ease: 'expo.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        }
      });

      if (footnote) {
        gsap.fromTo(footnote,
          { opacity: 0 },
          { opacity: 1, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: footnote, start: 'top 95%', toggleActions: 'play none none reverse' } }
        );
      }

      if (!prefersReducedMotion) {
        const animateNumber = (target: HTMLElement | null, finalValue: number, prefix = '', suffix = '') => {
          if (!target) return;
          const obj = { value: 0 };
          gsap.to(obj, {
            value: finalValue,
            duration: 2.5,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: target,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            },
            onUpdate: () => {
              const formatted = new Intl.NumberFormat('en-US').format(Math.floor(obj.value));
              target.innerText = `${prefix}${formatted}${suffix}`;
            }
          });
        };

        animateNumber(num1Ref.current, 200, '$', ' million');
        
        // Priority 4: Typographic moment for $200m
        if (num1WrapperRef.current) {
          gsap.fromTo(num1WrapperRef.current, 
            { scale: 3.5, color: '#0f172a', transformOrigin: 'left center' },
            {
              scale: 1,
              color: '#0d9488', // teal-600
              duration: 2,
              ease: 'elastic.out(1, 0.4)',
              scrollTrigger: {
                trigger: num1WrapperRef.current,
                start: 'top 75%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        }

        // Custom formatter for 1.7 billion
        if (num2Ref.current) {
          const obj2 = { value: 0 };
          gsap.to(obj2, {
            value: 1.7,
            duration: 2.5,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: num2Ref.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            },
            onUpdate: () => {
              num2Ref.current!.innerText = `$${obj2.value.toFixed(1)} billion`;
            }
          });
        }

        animateNumber(num3Ref.current, 2, '', ' million');
        animateNumber(num4Ref.current, 150, '', '');
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-32 px-6 relative z-10 bg-[radial-gradient(circle,_#f0fdfa_0%,_#f8fafc_100%)]">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="problem-card bg-white/70 backdrop-blur-md border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 hover:scale-[1.02] transition-transform duration-500 ease-out relative z-10 rotate-1 hover:rotate-1">
          <p className="text-3xl md:text-5xl font-light text-slate-700 leading-tight">
            Ghana loses an estimated <span ref={num1WrapperRef} className="inline-block relative z-20 drop-shadow-xl bg-teal-100 border border-teal-200 px-4 py-1 rounded-2xl rotate-2 mx-1 shadow-sm"><strong className="font-medium whitespace-nowrap text-teal-600" ref={num1Ref}>$200 million</strong></span> every year to flooding — over <strong className="text-teal-600 font-medium whitespace-nowrap" ref={num2Ref}>$1.7 billion</strong> in the past decade alone.
          </p>
        </div>

        <div className="problem-card bg-white/70 backdrop-blur-md border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 hover:scale-[1.02] transition-transform duration-500 ease-out ml-auto md:w-[85%] -rotate-1 hover:-rotate-1">
          <p className="text-3xl md:text-4xl font-light text-slate-700 leading-tight">
            More than <strong className="text-teal-600 font-medium whitespace-nowrap" ref={num3Ref}>2 million</strong> people are affected annually.
          </p>
        </div>

        <div className="problem-card bg-white/70 backdrop-blur-md border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 hover:scale-[1.02] transition-transform duration-500 ease-out mr-auto md:w-[90%] rotate-2 hover:rotate-2">
          <p className="text-3xl md:text-4xl font-light text-slate-700 leading-tight">
            In June 2015, a single flood disaster in Accra claimed over <strong className="text-teal-600 font-medium whitespace-nowrap" ref={num4Ref}>150</strong> lives in one night.
          </p>
        </div>

        <div className="text-center">
          <p className="problem-footnote inline-block text-sm text-slate-500 pt-8 border-t border-slate-200 px-8">
            (World Bank / MyJoyOnline estimates)
          </p>
        </div>
      </div>
    </section>
  );
}
