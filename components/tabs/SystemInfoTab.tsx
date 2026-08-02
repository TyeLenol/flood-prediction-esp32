'use client';

import { useFirebaseDataContext } from '@/lib/FirebaseDataContext';

/* ── Hardware component data ───────────────────────────────────────────────── */

interface HardwareComponent {
  id: string;
  name: string;
  category: string;
  description: string;
  role: string;
  icon: React.ReactNode;
  accentClass: string;
}

const HARDWARE: HardwareComponent[] = [
  {
    id: 'esp32',
    name: 'ESP32-WROOM-32',
    category: 'Core Controller',
    description:
      'Dual-core 240 MHz microcontroller with built-in Wi-Fi and Bluetooth. Manages all sensor polling, data formatting, and transmission to Firebase via the SIM7600 GSM module.',
    role: 'Brain of the system',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
      </svg>
    ),
    accentClass: 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800/50 text-violet-600 dark:text-violet-400',
  },
  {
    id: 'jsn-sr04t',
    name: 'JSN-SR04T',
    category: 'Water Level Sensor',
    description:
      'Waterproof ultrasonic distance sensor. Emits 40 kHz pulses and measures time-of-flight of the echo reflected from the water surface. Reliable in humid, splash-prone environments.',
    role: 'Primary flood detection',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
      </svg>
    ),
    accentClass: 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800/50 text-teal-600 dark:text-teal-400',
  },
  {
    id: 'rain-sensor',
    name: 'Rain Sensor Module',
    category: 'Rainfall Detection',
    description:
      'Dual-output rainfall sensor: digital output (HIGH/LOW) for instant rain-start detection, and analog output proportional to precipitation volume. The digital pin triggers the Rain Detected indicator; analog feeds the rainfall gauge.',
    role: 'Precipitation monitoring',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
      </svg>
    ),
    accentClass: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-400',
  },
  {
    id: 'soil-moisture',
    name: 'Capacitive Soil Moisture Sensor',
    category: 'Ground Saturation',
    description:
      'Capacitive-type sensor (not resistive) — measures dielectric permittivity changes as soil moisture varies. Output is 0–100% saturation. Saturated soil dramatically reduces infiltration rate, accelerating surface runoff.',
    role: 'Flood risk amplifier',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
      </svg>
    ),
    accentClass: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'sim7600',
    name: 'SIM7600 GSM/4G Module',
    category: 'Data Transmission',
    description:
      'LTE Cat-1 / 3G / 2G multi-band modem for remote cellular data upload. Used instead of Wi-Fi to enable deployment in rural or infrastructure-limited flood-prone areas. Communicates with Firebase Realtime Database over HTTPS.',
    role: 'Remote connectivity',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/>
      </svg>
    ),
    accentClass: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/50 text-orange-600 dark:text-orange-400',
  },
];

/* ── Architecture writeup sections ─────────────────────────────────────────── */

const ARCHITECTURE_SECTIONS = [
  {
    title: 'Data Pipeline',
    content:
      'The ESP32 polls sensors every configurable interval (default: 30 s). Readings are packaged into JSON and transmitted to Firebase Realtime Database via the SIM7600 using AT commands over UART. The Firebase SDK on the web client maintains a persistent WebSocket connection and receives updates in real time without polling.',
  },
  {
    title: 'Flood Prediction Engine',
    content:
      'The prediction algorithm uses a sliding window of the last 5 readings to compute the average rate of change (cm/min) of the water level. Before computing an ETA to the Warning or Danger threshold, it checks: (1) timestamps are at least 30 seconds apart to avoid rate inflation, and (2) the last reading is genuinely higher than the first by ≥ 0.5 cm to confirm an upward trend. If the ETA computes to less than 1 minute or more than 24 hours, it is suppressed as noise.',
  },
  {
    title: 'Threshold Logic',
    content:
      'Warning and Danger thresholds are stored in Firebase under /thresholds and can be updated remotely without reflashing firmware. The ESP32 reads these values on startup and applies them locally for LED/buzzer alerts. The dashboard reads the same values and applies them to the gauge color scale and reference lines.',
  },
  {
    title: 'Sensor Correlation Model',
    content:
      'The correlation chart overlays rainfall (mm, right axis) against water level (cm, left axis) on the same timeline. In a real flood event, rainfall spikes precede water level rises by a lag determined by catchment size and soil saturation. Observing this lag in the correlation chart provides early warning context beyond the raw level reading alone.',
  },
  {
    title: 'GSM Fallback Strategy',
    content:
      'If the SIM7600 fails to transmit within a configurable timeout, the ESP32 stores the reading in local flash (LittleFS) and retries on the next cycle. The dashboard\'s "Stale Data" indicator appears if the most recent reading is more than 2 minutes old, prompting a manual check of the module and SIM card status.',
  },
];

/* ── System Info tab ──────────────────────────────────────────────────────── */

export function SystemInfoTab() {
  const { reading, loading } = useFirebaseDataContext();

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="animate-fade-in-up stagger-1">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">System Info</h1>
        <p className="text-sm text-slate-500 dark:text-muted-foreground mt-0.5">
          Hardware components, sensor status, and system architecture documentation
        </p>
      </div>

      {/* Hardware component cards */}
      <section className="animate-fade-in-up stagger-2">
        <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
          Hardware Components
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {HARDWARE.map((hw, i) => (
            <div
              key={hw.id}
              className="
                rounded-2xl p-5
                bg-white dark:bg-card
                border border-slate-200 dark:border-white/[0.07]
                shadow-sm dark:shadow-none
                animate-fade-in-up
              "
              style={{ animationDelay: `${(i + 2) * 60}ms` }}
            >
              {/* Icon + name */}
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${hw.accentClass}`}>
                  {hw.icon}
                </div>
                <div>
                  <p className="font-display font-semibold text-slate-900 dark:text-slate-50 leading-snug">
                    {hw.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-muted-foreground">{hw.category}</p>
                </div>
              </div>
              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                {hw.description}
              </p>
              {/* Role badge */}
              <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border ${hw.accentClass}`}>
                {hw.role}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Sensor status */}
      <section className="animate-fade-in-up stagger-3">
        <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
          Sensor Status
        </h2>
        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-card shadow-sm dark:shadow-none p-6">
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="h-5 rounded-lg skeleton-shimmer" />
              ))}
            </div>
          ) : reading ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    All Sensors Online
                  </span>
                </div>
                <span className="text-xs text-slate-400 dark:text-muted-foreground">
                  Combined timestamp (per-sensor timestamps not tracked separately)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-white/[0.05]">
                {[
                  { label: 'JSN-SR04T (Water Level)',    value: `${reading.waterLevel.toFixed(1)} cm` },
                  { label: 'Rainfall Gauge',              value: `${reading.rainfall.toFixed(1)} mm`   },
                  { label: 'Soil Moisture Sensor',        value: `${reading.soilMoisture.toFixed(1)} %` },
                  { label: 'Digital Rain Detector',       value: reading.rainDetected ? 'Rain detected' : 'Clear' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 dark:bg-white/[0.03]">
                    <span className="text-xs text-slate-500 dark:text-muted-foreground">{label}</span>
                    <span className="text-xs font-semibold tabular-nums text-slate-800 dark:text-slate-200">{value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 dark:text-muted-foreground pt-1">
                Last reading: {new Date(reading.timestamp).toLocaleString()}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-400 dark:text-muted-foreground italic">
              No sensor data available.
            </p>
          )}
        </div>
      </section>

      {/* Architecture writeup — uncollapsed */}
      <section className="animate-fade-in-up stagger-4">
        <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
          System Architecture &amp; Prediction Logic
        </h2>
        <div className="space-y-4">
          {ARCHITECTURE_SECTIONS.map((section, i) => (
            <div
              key={section.title}
              className="
                rounded-2xl p-6
                bg-white dark:bg-card
                border border-slate-200 dark:border-white/[0.07]
                shadow-sm dark:shadow-none
                animate-fade-in-up
              "
              style={{ animationDelay: `${(i + 4) * 50}ms` }}
            >
              <h3 className="font-display font-semibold text-slate-900 dark:text-slate-50 mb-2">
                {section.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack footer */}
      <div className="flex flex-wrap gap-2 pb-2 animate-fade-in-up stagger-5">
        {['ESP32-WROOM', 'JSN-SR04T', 'SIM7600 GSM', 'Firebase RTDB', 'Next.js 16', 'Recharts'].map(tech => (
          <span
            key={tech}
            className="px-2.5 py-1 bg-slate-100 dark:bg-white/[0.06] text-[11px] font-mono text-slate-500 dark:text-slate-400 rounded-lg border border-slate-200 dark:border-white/[0.07]"
          >
            {tech}
          </span>
        ))}
      </div>

    </div>
  );
}
