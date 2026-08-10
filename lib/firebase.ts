import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getDatabase, type Database } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Firebase can't determine a database URL without a project ID, and throws
// synchronously from getDatabase() in that case — which would otherwise crash
// every SSR render when .env.local isn't set up yet, instead of failing
// gracefully in the UI.
export const isFirebaseConfigured = Boolean(
  firebaseConfig.projectId && firebaseConfig.databaseURL
);

let app: FirebaseApp | null = null;
let database: Database | null = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
} else {
  console.warn(
    '[Levee] Firebase is not configured — copy .env.example to .env.local and fill in your project values.'
  );
}

export { app, database };
