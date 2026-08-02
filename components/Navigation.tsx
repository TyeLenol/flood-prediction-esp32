'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const TABS = [
  { label: 'Overview',    href: '/'           },
  { label: 'Analytics',   href: '/analytics'  },
  { label: 'Alerts',      href: '/alerts'     },
  { label: 'System Info', href: '/system-info'},
] as const;

/** Inline SVG icons — no extra dependency */
function WaterDropIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
      <path d="M12 2.1c-.28 0-5.9 7.02-5.9 10.4a5.9 5.9 0 0011.8 0C17.9 9.12 12.28 2.1 12 2.1z"/>
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="5" strokeWidth="2"/>
      <path strokeLinecap="round" strokeWidth="2"
        d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
    </svg>
  );
}

export function Navigation() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Read persisted preference; fall back to OS preference
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored === 'dark' || (!stored && prefersDark);
    setDark(isDark);
    // Ensure class is in sync (the inline script in layout handles first paint)
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    document.documentElement.classList.toggle('light', !next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <header className="
      sticky top-0 z-50
      bg-white dark:bg-[oklch(0.11_0.013_240)]
      border-b border-slate-200 dark:border-white/[0.07]
      transition-colors duration-200
    ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="
              w-8 h-8 rounded-lg
              bg-teal-500/15 dark:bg-teal-400/15
              flex items-center justify-center
              group-hover:bg-teal-500/25 dark:group-hover:bg-teal-400/25
              transition-colors
            ">
              <svg className="w-4.5 h-4.5 text-teal-600 dark:text-teal-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2.1c-.28 0-5.9 7.02-5.9 10.4a5.9 5.9 0 0011.8 0C17.9 9.12 12.28 2.1 12 2.1z"/>
              </svg>
            </div>
            <span className="font-display font-bold text-base text-slate-900 dark:text-slate-50 hidden sm:block">
              FloodWatch
            </span>
          </Link>

          {/* ── Pill Tab Navigation ── */}
          <nav
            aria-label="Main navigation"
            className="
              flex items-center
              bg-slate-100 dark:bg-white/[0.06]
              rounded-full p-1 gap-0.5
              overflow-x-auto max-w-full
              [scrollbar-width:none] [-webkit-overflow-scrolling:touch]
            "
          >
            {TABS.map((tab) => {
              const isActive = tab.href === '/'
                ? pathname === '/'
                : pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`
                    px-3.5 py-1.5 text-sm font-medium rounded-full
                    whitespace-nowrap transition-all duration-200
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
                    ${isActive
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>

          {/* ── Right controls ── */}
          <div className="flex items-center shrink-0">
            {/* Theme toggle — suppress hydration mismatch by not rendering icon until mounted */}
            <button
              onClick={toggleTheme}
              className="
                w-9 h-9 flex items-center justify-center rounded-full
                text-slate-500 dark:text-slate-400
                hover:bg-slate-100 dark:hover:bg-white/10
                hover:text-slate-700 dark:hover:text-slate-200
                active:scale-95
                transition-all duration-150
                focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
              "
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {/* Render placeholder div until mounted to avoid hydration mismatch */}
              {mounted
                ? dark
                  ? <SunIcon className="w-4.5 h-4.5" />
                  : <MoonIcon className="w-4.5 h-4.5" />
                : <span className="w-4 h-4 block rounded-full bg-slate-300 dark:bg-slate-600 animate-pulse" />
              }
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
