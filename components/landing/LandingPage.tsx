'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticButton } from './MagneticButton';
import './landing.css';

gsap.registerPlugin(ScrollTrigger);

const TABS = [
  { id: 'telemetry', label: 'Global Telemetry' },
  { id: 'alerts', label: 'Real-time Alerts' },
  { id: 'health', label: 'Hardware Health' },
  { id: 'trends', label: 'Historical Trends' },
];

export function LandingPage() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  
  // Refs for animations
  const fadeRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    // Simple fade-up animations for everything marked with ref
    fadeRefs.current.forEach((el) => {
      if (!el) return;
      gsap.fromTo(el, 
        { opacity: 0, y: 30 },
        {
          opacity: 1, 
          y: 0,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true
          }
        }
      );
    });
  }, []);

  const addToFadeRefs = (el: HTMLElement | null) => {
    if (el && !fadeRefs.current.includes(el)) {
      fadeRefs.current.push(el);
    }
  };

  return (
    <main className="min-h-screen bg-[#050b14] text-slate-300 font-sans selection:bg-teal-500/30 selection:text-teal-200 overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-screen flex items-center">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-slate-900 bg-[url('/placeholder-hero.jpg')] bg-cover bg-center bg-no-repeat" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050b14] via-[#050b14]/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col justify-center">
          <div className="max-w-3xl">
            <h1 ref={addToFadeRefs} className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white tracking-[-0.04em] leading-[1.05] mb-6 drop-shadow-2xl">
              Flooding costs Ghana millions. <span className="text-teal-400">Levee tells you before it happens.</span>
            </h1>
            <p ref={addToFadeRefs} className="text-xl md:text-2xl text-slate-300 font-light mb-10 max-w-lg drop-shadow-lg">
              Real-time IoT flood monitoring for Ghana's flood-prone communities.
            </p>
            <div ref={addToFadeRefs}>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-teal-600 hover:bg-teal-500 rounded-full transition-colors duration-300 shadow-xl shadow-teal-900/20"
              >
                See it live &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM SECTION */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            <h2 ref={addToFadeRefs} className="text-3xl md:text-5xl font-light text-white tracking-[-0.02em] leading-tight">
              Ghana loses an estimated <span className="text-teal-400 font-medium">$200 million every year</span> to flooding &mdash; over $1.7 billion in the past decade alone.
            </h2>
            <h2 ref={addToFadeRefs} className="text-3xl md:text-5xl font-light text-slate-300 tracking-[-0.02em] leading-tight">
              More than <span className="text-teal-400 font-medium">2 million people</span> are affected annually.
            </h2>
            <h2 ref={addToFadeRefs} className="text-3xl md:text-5xl font-light text-slate-400 tracking-[-0.02em] leading-tight">
              In June 2015, a single flood disaster in Accra claimed over <span className="text-teal-400 font-medium">150 lives</span> in one night.
            </h2>
          </div>
          <p ref={addToFadeRefs} className="mt-16 text-sm text-slate-500 uppercase tracking-widest font-medium">
            (World Bank / MyJoyOnline estimates)
          </p>
        </div>
      </section>

      {/* 3. SOLUTION SECTION */}
      <section className="py-40 px-6 flex flex-col items-center justify-center text-center">
        <div className="max-w-4xl mx-auto">
          <h2 ref={addToFadeRefs} className="text-6xl md:text-8xl lg:text-[10rem] font-display font-bold text-white tracking-[-0.05em] leading-[0.9] mb-12">
            Our solution?<br/><span className="text-teal-500">Levee.</span>
          </h2>
          <p ref={addToFadeRefs} className="text-xl md:text-2xl text-slate-400 font-light max-w-2xl mx-auto">
            A distributed network of solar-powered, radar-based water level sensors providing early warning alerts before the floodwaters rise.
          </p>
        </div>
      </section>

      {/* 4. HOW IT WORKS (TABBED SECTION) */}
      <section className="py-24 px-6 bg-[#0a1420]">
        <div className="max-w-6xl mx-auto">
          {/* Tabs */}
          <div ref={addToFadeRefs} className="flex flex-wrap items-center justify-center gap-2 mb-16 border-b border-slate-800 pb-4">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-colors duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-slate-800 text-white' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

                    {/* Tab Content */}
          <div className="relative min-h-[500px]">
            {/* TAB 1: Global Telemetry */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${
              activeTab === 'telemetry' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
                <div className="lg:col-span-3 bg-slate-800/40 rounded-2xl border border-slate-800 p-8 flex flex-col justify-between overflow-hidden">
                  <div>
                    <h3 className="text-2xl font-semibold text-white tracking-tight mb-2">Global Telemetry</h3>
                    <p className="text-slate-400 font-light max-w-md">Monitor live water levels, soil saturation, and rainfall across all deployed sensor nodes.</p>
                  </div>
                  <div className="w-full mt-8 rounded-xl border border-slate-800/80 overflow-hidden shadow-2xl bg-slate-900 aspect-video flex items-center justify-center">
                    <img src="/overview.png" alt="Overview Dashboard" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-slate-800/40 rounded-2xl border border-slate-800 p-8 h-[calc(50%-12px)] flex flex-col justify-center">
                    <h4 className="text-teal-400 font-medium mb-2">Millimeter Precision</h4>
                    <p className="text-slate-300 font-light text-sm">Using JSN-SR04T ultrasonic sensors, water levels are measured with extreme accuracy and updated in real-time via the SIM7600 LTE module.</p>
                  </div>
                  <div className="bg-slate-800/40 rounded-2xl border border-slate-800 p-8 h-[calc(50%-12px)] flex flex-col justify-center">
                    <h4 className="text-teal-400 font-medium mb-2">Multi-Factor Context</h4>
                    <p className="text-slate-300 font-light text-sm">It's not just water level. Capacitive soil moisture and digital rain sensors provide the full environmental picture before floods happen.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* TAB 2: Alerts */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${
              activeTab === 'alerts' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
                <div className="lg:col-span-3 bg-slate-800/40 rounded-2xl border border-slate-800 p-8 flex flex-col justify-between overflow-hidden">
                  <div>
                    <h3 className="text-2xl font-semibold text-white tracking-tight mb-2">Real-time Alerts</h3>
                    <p className="text-slate-400 font-light max-w-md">Instant threshold breach detection and automated warning propagation.</p>
                  </div>
                  <div className="w-full mt-8 rounded-xl border border-slate-800/80 overflow-hidden shadow-2xl bg-slate-900 aspect-video flex items-center justify-center">
                    <img src="/alerts.png" alt="Alerts Dashboard" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-slate-800/40 rounded-2xl border border-slate-800 p-8 h-[calc(50%-12px)] flex flex-col justify-center">
                    <h4 className="text-teal-400 font-medium mb-2">Dynamic Thresholds</h4>
                    <p className="text-slate-300 font-light text-sm">Configure custom Warning and Danger levels (in cm) dynamically without having to re-flash the ESP32 hardware.</p>
                  </div>
                  <div className="bg-slate-800/40 rounded-2xl border border-slate-800 p-8 h-[calc(50%-12px)] flex flex-col justify-center">
                    <h4 className="text-teal-400 font-medium mb-2">Event Logging</h4>
                    <p className="text-slate-300 font-light text-sm">Every threshold breach is recorded immutably to Firebase, creating an auditable history of flood events for post-disaster analysis.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* TAB 3: Hardware Health */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${
              activeTab === 'health' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
                <div className="lg:col-span-3 bg-slate-800/40 rounded-2xl border border-slate-800 p-8 flex flex-col justify-between overflow-hidden">
                  <div>
                    <h3 className="text-2xl font-semibold text-white tracking-tight mb-2">Hardware Health</h3>
                    <p className="text-slate-400 font-light max-w-md">Deep visibility into the status of the remote ESP32 nodes and component lifecycle.</p>
                  </div>
                  <div className="w-full mt-8 rounded-xl border border-slate-800/80 overflow-hidden shadow-2xl bg-slate-900 aspect-video flex items-center justify-center">
                    <img src="/system.png" alt="System Info" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-slate-800/40 rounded-2xl border border-slate-800 p-8 h-[calc(50%-12px)] flex flex-col justify-center">
                    <h4 className="text-teal-400 font-medium mb-2">Connectivity Status</h4>
                    <p className="text-slate-300 font-light text-sm">Monitor GSM signal strength, battery levels, and the last-sync timestamp to ensure the node hasn't gone offline during a storm.</p>
                  </div>
                  <div className="bg-slate-800/40 rounded-2xl border border-slate-800 p-8 h-[calc(50%-12px)] flex flex-col justify-center">
                    <h4 className="text-teal-400 font-medium mb-2">Component Diagnostics</h4>
                    <p className="text-slate-300 font-light text-sm">Individual status checks for the ESP32-WROOM-32, JSN-SR04T, and SIM7600 modules, alerting you to hardware failure before it's critical.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* TAB 4: Trends */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${
              activeTab === 'trends' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
                <div className="lg:col-span-3 bg-slate-800/40 rounded-2xl border border-slate-800 p-8 flex flex-col justify-between overflow-hidden">
                  <div>
                    <h3 className="text-2xl font-semibold text-white tracking-tight mb-2">Historical Trends</h3>
                    <p className="text-slate-400 font-light max-w-md">Analyze rainfall intensity vs. water level rise to improve predictive models.</p>
                  </div>
                  <div className="w-full mt-8 rounded-xl border border-slate-800/80 overflow-hidden shadow-2xl bg-slate-900 aspect-video flex items-center justify-center">
                    <img src="/analytics.png" alt="Analytics Dashboard" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-slate-800/40 rounded-2xl border border-slate-800 p-8 h-[calc(50%-12px)] flex flex-col justify-center">
                    <h4 className="text-teal-400 font-medium mb-2">Sensor Correlation</h4>
                    <p className="text-slate-300 font-light text-sm">Graphically compare cumulative rainfall (mm) against water level rise (cm) over time to visualize the saturation point of the local terrain.</p>
                  </div>
                  <div className="bg-slate-800/40 rounded-2xl border border-slate-800 p-8 h-[calc(50%-12px)] flex flex-col justify-center">
                    <h4 className="text-teal-400 font-medium mb-2">Predictive Analysis</h4>
                    <p className="text-slate-300 font-light text-sm">By identifying how fast water rises per millimeter of rain, the system can project time-to-danger metrics before thresholds are actually hit.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Credibility Footer */}
          <div ref={addToFadeRefs} className="mt-20 pt-8 border-t border-slate-800/50 text-center text-slate-500 font-medium tracking-widest uppercase text-sm flex flex-wrap justify-center gap-x-8 gap-y-4">
            <span>8 sensors</span>
            <span className="hidden sm:inline text-slate-700">&middot;</span>
            <span>1 microcontroller</span>
            <span className="hidden sm:inline text-slate-700">&middot;</span>
            <span>Solar powered</span>
            <span className="hidden sm:inline text-slate-700">&middot;</span>
            <span>24/7 monitoring</span>
          </div>
        </div>
      </section>

      {/* 5. SIMULATION PROOF */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <div ref={addToFadeRefs} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight mb-4">
              Explore the live circuit
            </h2>
            <p className="text-lg text-slate-400 font-light">
              Interact with the ESP32 architecture powering the Levee sensors.
            </p>
          </div>

          <div ref={addToFadeRefs} className="w-full h-[600px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl shadow-black/50 bg-slate-900 mb-8">
            <iframe
              src="https://cirkitdesigner.com/project/63df3902-127e-46bd-85b2-a42e1edb7999?embed=true"
              className="w-full h-full"
              allowFullScreen
            />
          </div>
          
          <a ref={addToFadeRefs} href="https://cirkitdesigner.com/project/63df3902-127e-46bd-85b2-a42e1edb7999" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300 font-medium flex items-center gap-2 transition-colors">
            Open in Cirkit
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        </div>
      </section>

      {/* 6. CTA SECTION */}
      <section className="py-40 px-6 flex flex-col items-center text-center border-t border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 ref={addToFadeRefs} className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white tracking-[-0.04em] leading-[1.1] mb-12">
            Levee is ready.<br/>Help protect communities today.
          </h2>
          <div ref={addToFadeRefs} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <MagneticButton>
              <Link href="/dashboard" className="px-10 py-5 text-lg font-medium text-white bg-teal-600 hover:bg-teal-500 rounded-full transition-colors duration-300">
                See it live &rarr;
              </Link>
            </MagneticButton>
            <MagneticButton>
              <a href="https://github.com/TyeLenol/flood-prediction-esp32" target="_blank" rel="noopener noreferrer" className="px-10 py-5 text-lg font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors duration-300 flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                View on GitHub
              </a>
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* 7. MASSIVE FOOTER */}
      <footer className="w-full bg-[#03060a] pt-32 pb-8 overflow-hidden flex items-center justify-center border-t border-slate-900/50">
        {/* Massive Typography spanning width */}
        <h1 className="text-[22vw] font-display font-bold text-white tracking-[-0.05em] leading-none select-none opacity-80">
          LEVEE
        </h1>
      </footer>

    </main>
  );
}
