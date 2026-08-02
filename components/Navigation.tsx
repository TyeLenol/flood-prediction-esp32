'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useFirebaseDataContext } from '@/lib/FirebaseDataContext';
import type { HistoryEntry, Thresholds } from '@/lib/FirebaseDataContext';

/* ── Tab definitions ─────────────────────────────────────────────────────── */

const TABS = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
      </svg>
    ),
  },
  {
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
      </svg>
    ),
  },
  {
    label: 'Alerts',
    href: '/dashboard/alerts',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
      </svg>
    ),
  },
  {
    label: 'System Info',
    href: '/dashboard/system-info',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
      </svg>
    ),
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
        <circle cx="12" cy="12" r="3" strokeWidth={1.8}/>
      </svg>
    ),
  },
] as const;

/* ── Icon helpers ─────────────────────────────────────────────────────────── */

function SunIcon() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="5" strokeWidth="2"/>
      <path strokeLinecap="round" strokeWidth="2"
        d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
    </svg>
  );
}

function BellIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
    </svg>
  );
}

function GearIcon() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
      <circle cx="12" cy="12" r="3" strokeWidth={1.8}/>
    </svg>
  );
}

/* ── Time-ago formatter ───────────────────────────────────────────────────── */

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts * 1000) / 1000);
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? 's' : ''} ago`;
}

/* ── Alert event computation ─────────────────────────────────────────────── */

interface AlertEvent {
  timestamp: number;
  type: 'Warning' | 'Danger';
  level: number;
}

function computeRecentAlerts(history: HistoryEntry[], thresholds: Thresholds | null): AlertEvent[] {
  if (!thresholds || history.length < 2) return [];
  const events: AlertEvent[] = [];
  for (let i = 1; i < history.length; i++) {
    const prev = history[i - 1];
    const curr = history[i];
    if (curr.waterLevel >= thresholds.danger && prev.waterLevel < thresholds.danger) {
      events.push({ timestamp: curr.timestamp, type: 'Danger', level: curr.waterLevel });
    } else if (
      curr.waterLevel >= thresholds.warning &&
      prev.waterLevel < thresholds.warning &&
      curr.waterLevel < thresholds.danger
    ) {
      events.push({ timestamp: curr.timestamp, type: 'Warning', level: curr.waterLevel });
    }
  }
  return events.slice(-3).reverse();
}

/* ── Notification bell ────────────────────────────────────────────────────── */

function NavBell({ dropdownSide = 'right' }: { dropdownSide?: 'right' | 'left' }) {
  const { history, thresholds } = useFirebaseDataContext();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const alerts = useMemo(() => computeRecentAlerts(history, thresholds), [history, thresholds]);
  const hasAlerts = alerts.length > 0;

  const handleOutside = useCallback((e: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
  }, []);

  useEffect(() => {
    if (open) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open, handleOutside]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`
          relative w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-150
          focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
          ${open
            ? 'bg-slate-100 text-slate-800 dark:bg-white/[0.10] dark:text-white'
            : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/[0.08] dark:hover:text-slate-200'}
        `}
        aria-label="Notifications"
        aria-expanded={open}
      >
        <BellIcon />
        {hasAlerts && (
          <span
            aria-label={`${alerts.length} new alerts`}
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-950"
          />
        )}
      </button>

      {open && (
        <div className={`
          absolute top-full mt-2 w-80 z-50
          bg-white dark:bg-slate-900
          border border-slate-200 dark:border-white/[0.08]
          rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-black/50
          overflow-hidden
          ${dropdownSide === 'left' ? 'left-0' : 'right-0'}
        `}>
          <div className="px-4 pt-3 pb-2 border-b border-slate-100 dark:border-white/[0.06]">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Notifications</p>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="px-4 py-6 flex flex-col items-center gap-2">
                <BellIcon size={28} />
                <p className="text-sm text-slate-400 dark:text-slate-500">No new notifications</p>
              </div>
            ) : alerts.map((a) => (
              <div
                key={`${a.timestamp}-${a.type}`}
                className="flex items-start gap-3 px-4 py-3 border-b border-slate-50 dark:border-white/[0.04] last:border-0 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors"
              >
                <span className={`mt-0.5 shrink-0 w-2 h-2 rounded-full ${a.type === 'Danger' ? 'bg-red-500' : 'bg-amber-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-snug">
                    <span className={`font-semibold ${a.type === 'Danger' ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {a.type}:
                    </span>{' '}
                    Water level reached {a.level.toFixed(1)} cm
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 tabular-nums">{timeAgo(a.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-2.5 border-t border-slate-100 dark:border-white/[0.06]">
            <Link
              href="/dashboard/alerts"
              onClick={() => setOpen(false)}
              className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
            >
              View all alerts →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Shared styles ────────────────────────────────────────────────────────── */

const iconBtn = `
  w-8 h-8 flex items-center justify-center rounded-lg
  text-slate-400 dark:text-slate-500
  hover:bg-slate-100 hover:text-slate-700
  dark:hover:bg-white/[0.08] dark:hover:text-slate-200
  active:scale-95 transition-all duration-150
  focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
`;

/* ── Logo mark (shared between bar and sidebar) ───────────────────────────── */

function LogoMark({ wordmark = true }: { wordmark?: boolean }) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <div className="w-7 h-7 rounded-lg bg-teal-500/15 dark:bg-teal-400/15 flex items-center justify-center">
        <svg className="w-4 h-4 text-teal-600 dark:text-teal-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2.1c-.28 0-5.9 7.02-5.9 10.4a5.9 5.9 0 0011.8 0C17.9 9.12 12.28 2.1 12 2.1z"/>
        </svg>
      </div>
      {wordmark && (
        <span className="font-display font-bold text-sm text-slate-900 dark:text-slate-50">Levee</span>
      )}
    </div>
  );
}

/* ── Mobile sidebar drawer ────────────────────────────────────────────────── */

function MobileSidebar({
  open,
  onClose,
  pathname,
  dark,
  mounted,
  onToggleTheme,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
  dark: boolean;
  mounted: boolean;
  onToggleTheme: () => void;
}) {
  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          md:hidden fixed inset-0 z-[55]
          bg-black/50 backdrop-blur-sm
          transition-opacity duration-300
          ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
        aria-hidden
      />

      {/* Drawer */}
      <aside
        className={`
          md:hidden fixed top-0 left-0 bottom-0 z-[60]
          w-[280px] flex flex-col
          bg-slate-950 dark:bg-slate-950
          border-r border-white/[0.07]
          transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-label="Mobile navigation"
        aria-modal="true"
        role="dialog"
      >
        {/* Subtle teal glow at top */}
        <div
          className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 30% 0%, rgba(20,184,166,0.12) 0%, transparent 70%)',
          }}
        />

        {/* ── Header ── */}
        <div className="relative flex items-center justify-between px-5 pt-5 pb-4">
          <Link href="/" onClick={onClose} className="group">
            <LogoMark wordmark />
          </Link>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-white/[0.07] hover:text-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            aria-label="Close navigation"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* ── Divider ── */}
        <div className="mx-5 h-px bg-white/[0.06]" />

        {/* ── Nav links ── */}
        <nav className="flex-1 flex flex-col gap-1 px-3 pt-4 overflow-y-auto" aria-label="Main navigation">
          {TABS.map((tab) => {
            const isActive = tab.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                onClick={onClose}
                aria-current={isActive ? 'page' : undefined}
                className={`
                  relative flex items-center gap-3.5 px-3.5 py-3 rounded-xl
                  text-sm font-medium
                  transition-all duration-150 group
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
                  ${isActive
                    ? 'bg-teal-500/10 text-teal-300'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.05]'}
                `}
              >
                {/* Active left accent bar */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-teal-400" />
                )}
                {/* Icon */}
                <span className={`shrink-0 transition-colors ${isActive ? 'text-teal-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                  {tab.icon}
                </span>
                {tab.label}
                {/* Active dot indicator */}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Bottom cluster ── */}
        <div className="px-3 pb-6 pt-3 space-y-1">
          <div className="mx-2 mb-3 h-px bg-white/[0.06]" />

          {/* Theme toggle row */}
          <button
            onClick={onToggleTheme}
            className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-white/[0.05] transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span className="shrink-0 text-slate-500">
              {mounted ? (dark ? <SunIcon /> : <MoonIcon />) : <span className="w-[18px] h-[18px] rounded-full block bg-slate-700 animate-pulse" />}
            </span>
            {dark ? 'Light mode' : 'Dark mode'}
          </button>

          {/* App version watermark */}
          <p className="px-3.5 pt-2 text-xs text-slate-700 select-none">Levee · Flood Monitoring</p>
        </div>
      </aside>
    </>
  );
}

/* ── Main Navigation ─────────────────────────────────────────────────────── */

export function Navigation() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored === 'dark' || (!stored && prefersDark);
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
  }, []);

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  const toggleTheme = useCallback(() => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    document.documentElement.classList.toggle('light', !next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }, [dark]);

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════════
          MOBILE  — top bar + sidebar drawer (hidden on md+)
      ════════════════════════════════════════════════════════════════════ */}
      <header className="md:hidden sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200/70 dark:border-white/[0.07]">
        <div className="flex items-center h-14 px-4">
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.07] hover:text-slate-800 dark:hover:text-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 mr-2"
            aria-label="Open navigation"
            aria-expanded={sidebarOpen}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          {/* Logo — centred */}
          <Link href="/" className="flex items-center gap-2 group mx-auto">
            <div className="w-7 h-7 rounded-lg bg-teal-500/15 dark:bg-teal-400/15 flex items-center justify-center group-hover:bg-teal-500/25 dark:group-hover:bg-teal-400/25 transition-colors">
              <svg className="w-4 h-4 text-teal-600 dark:text-teal-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2.1c-.28 0-5.9 7.02-5.9 10.4a5.9 5.9 0 0011.8 0C17.9 9.12 12.28 2.1 12 2.1z"/>
              </svg>
            </div>
            <span className="font-display font-bold text-sm text-slate-900 dark:text-slate-50">Levee</span>
          </Link>

          {/* Right: bell */}
          <div className="flex items-center gap-0.5 ml-auto">
            <NavBell dropdownSide="right" />
          </div>
        </div>
      </header>

      {/* Mobile sidebar */}
      <MobileSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        pathname={pathname}
        dark={dark}
        mounted={mounted}
        onToggleTheme={toggleTheme}
      />

      {/* ════════════════════════════════════════════════════════════════════
          DESKTOP  — full-width bar (hidden on mobile)
      ════════════════════════════════════════════════════════════════════ */}
      <header className="hidden md:block sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200/70 dark:border-white/[0.07]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-14 gap-4">

            {/* Logo */}
            <Link href="/" className="shrink-0 group">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-500/15 dark:bg-teal-400/15 flex items-center justify-center group-hover:bg-teal-500/25 dark:group-hover:bg-teal-400/25 transition-colors">
                  <svg className="w-4 h-4 text-teal-600 dark:text-teal-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 2.1c-.28 0-5.9 7.02-5.9 10.4a5.9 5.9 0 0011.8 0C17.9 9.12 12.28 2.1 12 2.1z"/>
                  </svg>
                </div>
                <span className="font-display font-bold text-sm text-slate-900 dark:text-slate-50">Levee</span>
              </div>
            </Link>

            <div className="flex-1" />

            {/* Tab navigation */}
            <nav aria-label="Main navigation" className="flex items-center gap-0.5">
              {TABS.map((tab) => {
                const isActive = tab.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(tab.href);
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`
                      px-3.5 py-1.5 text-[13px] font-medium rounded-lg whitespace-nowrap
                      transition-all duration-150
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
                      ${isActive
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-white/[0.06]'}
                    `}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex-1" />

            {/* Right controls */}
            <div className="flex items-center gap-0.5 shrink-0">
              <Link href="/dashboard/settings" className={iconBtn} aria-label="Settings">
                <GearIcon />
              </Link>
              <NavBell />
              <button
                onClick={toggleTheme}
                className={iconBtn}
                aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {mounted
                  ? dark ? <SunIcon /> : <MoonIcon />
                  : <span className="w-[18px] h-[18px] rounded-full block bg-slate-200 dark:bg-slate-700 animate-pulse" />
                }
              </button>
            </div>

          </div>
        </div>
      </header>
    </>
  );
}
