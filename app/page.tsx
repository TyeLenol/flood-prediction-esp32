import { Metadata } from 'next';
import { LandingPage } from '@/components/landing/LandingPage';

export const metadata: Metadata = {
  title: 'Levee — Flood Prediction for Ghana',
  description: 'Real-time IoT flood monitoring system designed for vulnerable communities.',
};

export default function LandingPageRoute() {
  return <LandingPage />;
}
