'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './landing.css';
import { SmoothScroll } from './SmoothScroll';
import { Preloader } from './Preloader';
import { BackgroundAtmosphere } from './BackgroundAtmosphere';
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
      <Preloader />
      <BackgroundAtmosphere />
      <div 
        ref={containerRef} 
        className="text-slate-200 min-h-screen overflow-x-hidden selection:bg-teal-500/30 font-sans relative z-10"
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
