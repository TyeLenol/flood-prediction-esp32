'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useFirebaseData } from './useFirebaseData';
import type { Reading, HistoryEntry, Thresholds } from './useFirebaseData';

export type { Reading, HistoryEntry, Thresholds };

interface FirebaseDataContextValue {
  reading: Reading | null;
  history: HistoryEntry[];
  thresholds: Thresholds | null;
  loading: boolean;
  error: string | null;
}

const FirebaseDataContext = createContext<FirebaseDataContextValue>({
  reading: null,
  history: [],
  thresholds: null,
  loading: true,
  error: null,
});

/**
 * Wraps the app at layout level so Firebase connects once and stays alive
 * across all tab navigations — no re-subscription on route change.
 */
export function FirebaseDataProvider({ children }: { children: ReactNode }) {
  const data = useFirebaseData();
  return (
    <FirebaseDataContext.Provider value={data}>
      {children}
    </FirebaseDataContext.Provider>
  );
}

export function useFirebaseDataContext(): FirebaseDataContextValue {
  return useContext(FirebaseDataContext);
}
