'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const TABS = [
  { label: 'Overview',    href: '/'           },
  { label: 'Analytics',   href: '/analytics'  },
  { label: 'Alerts',      href: '/alerts'     },
  { label: 'System Info', href: '/system-info'},
  { label: 'Settings',    href: '/settings'   },
] as const;

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
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored === 'dark' || (!stored && prefersDark);
    setDark(isDark);
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
    /* Outer sticky wrapper — provides the top-spacing that makes the pill "float" */
    <div className="sticky top-4 z-50 flex justify-center px-4 sm:px-6 pointer-events-none">
      {/* Floating pill container */}
      <div className="
        pointer-events-auto
        flex items-center gap-3 w-full max-w-5xl
        bg-white/90 dark:bg-slate-900/90
        backdrop-blur-xl
        rounded-2xl
        border border-slate-200/80 dark:border-white/[0.09]
        shadow-xl shadow-slate-200/60 dark:shadow-black/40
        px-4 py-2.5
        transition-colors duration-200
      ">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group mr-1">
          <div className="
            w-7 h-7 rounded-lg
            bg-teal-500/15 dark:bg-teal-400/15
            flex items-center justify-center
            group-hover:bg-teal-500/30 dark:group-hover:bg-teal-400/30
            transition-colors
          ">
            <svg className="w-4 h-4 text-teal-600 dark:text-teal-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2.1c-.28 0-5.9 7.02-5.9 10.4a5.9 5.9 0 0011.8 0C17.9 9.12 12.28 2.1 12 2.1z"/>
            </svg>
          </div>
          <span className="font-display font-bold text-sm text-slate-900 dark:text-slate-50 hidden sm:block whitespace-nowrap">
            FloodWatch
          </span>
        </Link>

        {/* ── Pill tab navigation (fills available space, scrollable on mobile) ── */}
        <nav
          aria-label="Main navigation"
          className="
            flex-1
            flex items-center
            bg-slate-100 dark:bg-white/[0.06]
            rounded-xl p-1 gap-0.5
            overflow-x-auto
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
                  px-3 py-1.5 text-xs font-medium rounded-lg
                  whitespace-nowrap transition-all duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
                  ${isActive
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-white/[0.08]'}
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        {/* ── Right control cluster ── */}
        <div className="flex items-center gap-1 shrink-0 ml-1">
          {/* Settings gear (links directly to settings tab) */}
          <Link
            href="/settings"
            className="
              w-8 h-8 flex items-center justify-center rounded-lg
              text-slate-400 dark:text-slate-500
              hover:bg-slate-100 dark:hover:bg-white/[0.08]
              hover:text-slate-700 dark:hover:text-slate-200
              active:scale-95 transition-all duration-150
              focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
            "
            aria-label="Settings"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <circle cx="12" cy="12" r="3" strokeWidth={1.8}/>
            </svg>
          </Link>

          {/* Light/dark toggle */}
          <button
            onClick={toggleTheme}
            className="
              w-8 h-8 flex items-center justify-center rounded-lg
              text-slate-400 dark:text-slate-500
              hover:bg-slate-100 dark:hover:bg-white/[0.08]
              hover:text-slate-700 dark:hover:text-slate-200
              active:scale-95 transition-all duration-150
              focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
            "
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {mounted
              ? dark
                ? <SunIcon  className="w-4 h-4" />
                : <MoonIcon className="w-4 h-4" />
              : <span className="w-4 h-4 rounded-full block bg-slate-200 dark:bg-slate-700 animate-pulse" />
            }
          </button>
        </div>

      </div>
    </div>
  );
}
