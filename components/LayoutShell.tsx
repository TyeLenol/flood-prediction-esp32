'use client';

import { usePathname } from 'next/navigation';
import { FirebaseDataProvider } from '@/lib/FirebaseDataContext';
import { Navigation } from '@/components/Navigation';
import type { ReactNode } from 'react';

/**
 * Renders the dashboard chrome (Navigation + Firebase provider + padded main)
 * on all /dashboard routes. The root route (/) is the landing page and gets a clean full-bleed canvas.
 */
export function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  if (!isDashboard) {
    return <>{children}</>;
  }

  return (
    <FirebaseDataProvider>
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {children}
      </main>
    </FirebaseDataProvider>
  );
}
