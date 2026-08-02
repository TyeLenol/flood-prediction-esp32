'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './landing.css';
import { SmoothScroll } from './SmoothScroll';
import { HeroSection } from './sections/HeroSection';
import { ProblemSection } from './sections/ProblemSection';
import { SolutionSection } from './sections/SolutionSection';
import { DisassembleSection } from './sections/DisassembleSection';
import { DeploymentSection } from './sections/DeploymentSection';
import { SimulationSection } from './sections/SimulationSection';
import { CTASection } from './sections/CTASection';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clear out ScrollTriggers on unmount
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <SmoothScroll>
      <div 
        ref={containerRef} 
        className="bg-[#050b14] text-slate-200 min-h-screen overflow-x-hidden selection:bg-teal-500/30 font-sans"
      >
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <DisassembleSection />
        <DeploymentSection />
        <SimulationSection />
        <CTASection />
      </div>
    </SmoothScroll>
  );
}
