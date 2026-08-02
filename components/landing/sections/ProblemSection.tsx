'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function ProblemSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const num1Ref = useRef<HTMLElement>(null);
  const num2Ref = useRef<HTMLElement>(null);
  const num3Ref = useRef<HTMLElement>(null);
  const num4Ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const paragraphs = gsap.utils.toArray<HTMLParagraphElement>('.problem-text');
      const footnote = document.querySelector('.problem-footnote');

      paragraphs.forEach((p) => {
        // Text masking setup
        const innerText = p.querySelector('.mask-inner');
        
        if (prefersReducedMotion) {
          gsap.set(innerText, { y: '0%' });
        } else {
          gsap.fromTo(innerText, 
            { y: '100%' },
            {
              y: '0%', 
              duration: 1.2, 
              ease: 'expo.out',
              scrollTrigger: {
                trigger: p,
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

      // Number count-up logic
      if (!prefersReducedMotion) {
        const animateNumber = (target: HTMLElement | null, finalValue: number, prefix = '', suffix = '') => {
          if (!target) return;
          const obj = { value: 0 };
          gsap.to(obj, {
            value: finalValue,
            duration: 2,
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
        animateNumber(num2Ref.current, 1700, '$', ' million'); // 1.7 billion = 1,700 million formatted as $1,700 million or we can format it differently, let's do $1.7 billion manually
        
        // Custom formatter for 1.7 billion
        if (num2Ref.current) {
          const obj2 = { value: 0 };
          gsap.to(obj2, {
            value: 1.7,
            duration: 2,
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
    <section ref={containerRef} className="py-32 px-6 relative z-10">
      <div className="max-w-3xl mx-auto space-y-16">
        <p className="problem-text text-3xl md:text-4xl lg:text-5xl font-light text-slate-300 leading-tight overflow-hidden pb-4 -mb-4">
          <span className="mask-inner block">
            Ghana loses an estimated <strong className="text-teal-400 font-medium whitespace-nowrap" ref={num1Ref}>$200 million</strong> every year to flooding — over <strong className="text-teal-400 font-medium whitespace-nowrap" ref={num2Ref}>$1.7 billion</strong> in the past decade alone.
          </span>
        </p>

        <p className="problem-text text-3xl md:text-4xl lg:text-5xl font-light text-slate-300 leading-tight overflow-hidden pb-4 -mb-4">
          <span className="mask-inner block">
            More than <strong className="text-teal-400 font-medium whitespace-nowrap" ref={num3Ref}>2 million</strong> people are affected annually.
          </span>
        </p>

        <p className="problem-text text-3xl md:text-4xl lg:text-5xl font-light text-slate-300 leading-tight overflow-hidden pb-4 -mb-4">
          <span className="mask-inner block">
            In June 2015, a single flood disaster in Accra claimed over <strong className="text-teal-400 font-medium whitespace-nowrap" ref={num4Ref}>150</strong> lives in one night.
          </span>
        </p>

        <p className="problem-footnote text-sm text-slate-500 pt-8 border-t border-white/5">
          (World Bank / MyJoyOnline estimates)
        </p>
      </div>
    </section>
  );
}
