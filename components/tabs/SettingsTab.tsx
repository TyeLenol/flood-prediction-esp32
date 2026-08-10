'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useFirebaseDataContext } from '@/lib/FirebaseDataContext';
import { InfoTooltip } from '@/components/InfoTooltip';
import { saveDeviceLocation, saveThresholds } from '@/lib/firebaseWrite';

/* ── Dynamic Leaflet import (must be ssr:false — Leaflet needs window) ────── */
const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-72 rounded-xl skeleton-shimmer" />
  ),
});

/* ── Default map center (Accra, Ghana — adjust to your locale) ────────────── */
const DEFAULT_LAT = 5.6037;
const DEFAULT_LNG = -0.1870;

/* ── Reusable form field ─────────────────────────────────────────────────── */
function Field({
  id, label, value, onChange, type = 'text', min, max, step, unit,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          min={min}
          max={max}
          step={step}
          className="
            flex-1 px-3 py-2 rounded-lg text-sm
            bg-slate-50 dark:bg-white/[0.05]
            border border-slate-200 dark:border-white/[0.10]
            text-slate-900 dark:text-slate-100
            placeholder:text-slate-400 dark:placeholder:text-slate-600
            focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
            transition-all tabular-nums
          "
        />
        {unit && (
          <span className="text-xs text-slate-400 dark:text-muted-foreground shrink-0">{unit}</span>
        )}
      </div>
    </div>
  );
}

/* ── Section card wrapper ────────────────────────────────────────────────── */
function Section({ title, children, tooltip }: {
  title: string;
  children: React.ReactNode;
  tooltip?: string;
}) {
  return (
    <div className="
      rounded-2xl p-6
      bg-white dark:bg-card
      border border-slate-200 dark:border-white/[0.07]
      shadow-sm dark:shadow-none
    ">
      <div className="flex items-center gap-1 mb-5">
        <h2 className="font-display text-base font-semibold text-slate-900 dark:text-slate-50">
          {title}
        </h2>
        {tooltip && <InfoTooltip content={tooltip} />}
      </div>
      {children}
    </div>
  );
}

/* ── Save button ─────────────────────────────────────────────────────────── */
type SaveState = 'idle' | 'saving' | 'saved' | 'error';

function SaveButton({
  onClick, state, label = 'Save',
}: {
  onClick: () => void;
  state: SaveState;
  label?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={state === 'saving'}
      className="
        px-4 py-2 rounded-lg text-sm font-medium
        bg-teal-600 hover:bg-teal-500 dark:bg-teal-600 dark:hover:bg-teal-500
        text-white
        border border-teal-700 dark:border-teal-500/50
        shadow-sm
        disabled:opacity-60 disabled:cursor-not-allowed
        active:scale-95 transition-all duration-150
        focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900
      "
    >
      {state === 'saving' ? 'Saving…' : label}
    </button>
  );
}

function StatusMessage({ state }: { state: SaveState }) {
  if (state === 'idle' || state === 'saving') return null;
  return (
    <span className={`text-xs font-medium ${
      state === 'saved' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
    }`}>
      {state === 'saved' ? '✓ Saved successfully' : '✗ Save failed — check console'}
    </span>
  );
}

/* ── Settings tab ────────────────────────────────────────────────────────── */

export function SettingsTab() {
  const { thresholds, deviceLocation } = useFirebaseDataContext();
  const DEFAULT_LAT = 6.6745;
  const DEFAULT_LNG = -1.5716;

  const [lat, setLat] = useState(String(DEFAULT_LAT));
  const [lng, setLng] = useState(String(DEFAULT_LNG));
  const [locSave, setLocSave] = useState<SaveState>('idle');

  // Map display coordinates — committed on Save, not on every keystroke
  const [mapLat, setMapLat] = useState(DEFAULT_LAT);
  const [mapLng, setMapLng] = useState(DEFAULT_LNG);
  const [hasLocation, setHasLocation] = useState(false);

  // Sync form fields when Firebase data arrives (on first load or after reload)
  useEffect(() => {
    if (deviceLocation.latitude !== null && deviceLocation.longitude !== null) {
      setLat(String(deviceLocation.latitude));
      setLng(String(deviceLocation.longitude));
      setMapLat(deviceLocation.latitude);
      setMapLng(deviceLocation.longitude);
      setHasLocation(true);
    }
  }, [deviceLocation.latitude, deviceLocation.longitude]);

  const handleSaveLocation = async () => {
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    const isValid =
      !isNaN(parsedLat) && !isNaN(parsedLng) &&
      parsedLat >= -90 && parsedLat <= 90 &&
      parsedLng >= -180 && parsedLng <= 180;

    if (!isValid) {
      setLocSave('error');
      setTimeout(() => setLocSave('idle'), 4000);
      return;
    }

    setLocSave('saving');
    try {
      await saveDeviceLocation(parsedLat, parsedLng);
      // Update map view immediately — Firebase listener will also update on next tick
      setMapLat(parsedLat);
      setMapLng(parsedLng);
      setHasLocation(true);
      setLocSave('saved');
    } catch {
      setLocSave('error');
    }
    setTimeout(() => setLocSave('idle'), 4000);
  };

  /* ── Thresholds state ── */
  const [warnVal,  setWarnVal]  = useState('');
  const [dangerVal, setDangerVal] = useState('');
  const [thrSave,  setThrSave]  = useState<SaveState>('idle');

  // Pre-fill from Firebase
  useEffect(() => {
    if (thresholds) {
      setWarnVal(String(thresholds.warning));
      setDangerVal(String(thresholds.danger));
    }
  }, [thresholds]);

  const handleSaveThresholds = async () => {
    const w = parseFloat(warnVal);
    const d = parseFloat(dangerVal);
    if (isNaN(w) || isNaN(d)) return;
    if (w >= d) {
      alert('Warning level must be lower than Danger level.');
      return;
    }
    setThrSave('saving');
    try {
      await saveThresholds(w, d);
      setThrSave('saved');
    } catch {
      setThrSave('error');
    }
    setTimeout(() => setThrSave('idle'), 4000);
  };

  /* ── Appearance ── */
  // Reads current dark state from html class
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleAppearance = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    document.documentElement.classList.toggle('light', !next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <div className="space-y-6 max-w-2xl">

      {/* Page title */}
      <div className="animate-fade-in-up stagger-1">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-muted-foreground mt-0.5">
          Device configuration, alert thresholds, and appearance
        </p>
      </div>

      {/* ── Device Location ─────────────────────────────────────────────── */}
      <Section
        title="Device Location"
        tooltip="This device does not have GPS hardware. Location is set manually and should be updated if the sensor node is moved to a new site."
      >
        <div className="animate-fade-in-up stagger-2 space-y-4">
          <p className="text-xs text-slate-500 dark:text-muted-foreground">
            Enter decimal-degree coordinates for the monitoring station. Used for map display only — does not affect sensor readings.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              id="latitude"
              label="Latitude"
              value={lat}
              onChange={setLat}
              type="number"
              min={-90}
              max={90}
              step={0.00001}
            />
            <Field
              id="longitude"
              label="Longitude"
              value={lng}
              onChange={setLng}
              type="number"
              min={-180}
              max={180}
              step={0.00001}
            />
          </div>
          <div className="flex items-center gap-3">
            <SaveButton onClick={handleSaveLocation} state={locSave} label="Save Location" />
            <StatusMessage state={locSave} />
          </div>

          {/* Map */}
          <div className="mt-2">
            {hasLocation ? (
              <LeafletMap latitude={mapLat} longitude={mapLng} />
            ) : (
              <div className="w-full h-72 rounded-xl border border-dashed border-slate-200 dark:border-white/[0.10] bg-slate-50/50 dark:bg-white/[0.02] flex flex-col items-center justify-center gap-2">
                <svg className="w-8 h-8 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <p className="text-sm font-medium text-slate-400 dark:text-slate-600">
                  No location saved yet
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-600">
                  Enter coordinates above and press Save Location
                </p>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* ── Alert Thresholds ─────────────────────────────────────────────── */}
      <Section title="Alert Thresholds">
        <div className="animate-fade-in-up stagger-3 space-y-4">
          <p className="text-xs text-slate-500 dark:text-muted-foreground">
            Water level thresholds (cm) that trigger Warning and Danger status changes. Warning must be lower than Danger.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              id="warning-level"
              label="Warning Level"
              value={warnVal}
              onChange={setWarnVal}
              type="number"
              min={0}
              step={1}
              unit="cm"
            />
            <Field
              id="danger-level"
              label="Danger Level"
              value={dangerVal}
              onChange={setDangerVal}
              type="number"
              min={0}
              step={1}
              unit="cm"
            />
          </div>
          {thresholds && parseFloat(warnVal) >= parseFloat(dangerVal) && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Warning level must be lower than Danger level.
            </p>
          )}
          <div className="flex items-center gap-3">
            <SaveButton onClick={handleSaveThresholds} state={thrSave} label="Save Thresholds" />
            <StatusMessage state={thrSave} />
          </div>
        </div>
      </Section>

      {/* ── Appearance ───────────────────────────────────────────────────── */}
      <Section title="Appearance">
        <div className="animate-fade-in-up stagger-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Dark mode</p>
              <p className="text-xs text-slate-400 dark:text-muted-foreground mt-0.5">
                Toggle between light and dark interface
              </p>
            </div>
            {/* Toggle switch */}
            <button
              role="switch"
              aria-checked={isDark}
              onClick={toggleAppearance}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full
                transition-colors duration-200 cursor-pointer
                focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
                ${isDark ? 'bg-teal-600' : 'bg-slate-200 dark:bg-slate-700'}
              `}
              aria-label="Toggle dark mode"
            >
              <span
                className={`
                  inline-block w-4 h-4 rounded-full bg-white shadow-sm
                  transition-transform duration-200
                  ${isDark ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        </div>
      </Section>

    </div>
  );
}
