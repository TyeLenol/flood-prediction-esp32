# Levee — Flood prediction and early warning for Ghana

Levee is a real‑time IoT flood monitoring and early‑warning platform built around low‑power ESP32 sensor nodes and a lightweight Next.js dashboard. It combines radar/ultrasonic water‑level sensing, environmental context (rain/soil moisture), cellular connectivity, and Firebase-backed telemetry to provide dashboards, alerts, and historical analysis for flood‑prone communities.

Key goals:
- Detect rising water levels early and notify stakeholders before flooding becomes critical.
- Provide remote hardware health visibility for distributed sensor nodes.
- Offer simple tooling for simulation, analysis and field deployments.

---

## Quick links
- Live app entry (landing): `/` (app/page.tsx — "Levee — Flood Prediction for Ghana")
- Dashboard: `/dashboard`
- Interactive circuit (ESP32): https://app.cirkitdesigner.com/project/015e1989-9bc9-4fae-a0c5-0013a998343f (embedded in the landing page)
- Repo: https://github.com/TyeLenol/flood-prediction-esp32

---

## What’s included (high level)
Top-level layout:
- app/ — Next.js App Router routes and global styles (landing + dashboard entry points)
- components/ — React components (landing page, magnetic button, UI primitives)
  - components/landing — landing page UI and styling (LandingPage.tsx, landing.css, MagneticButton)
- lib/ — lightweight utilities and platform integrations (lib/firebase.ts)
- public/ — static assets (images used in the landing and dashboard)
- package.json — project dependencies & scripts
- .env.example — required Firebase environment variables

---

## Stack
- Language: TypeScript (Next.js + React)
- Framework: Next.js (App Router)
- Hosting / Realtime: Firebase Realtime Database (client SDK used)
- Frontend libraries: Leaflet (maps), react-leaflet, Recharts (charts), GSAP (animations), Tailwind CSS, lucide-react icons, shadcn UI primitives

Notable dependencies (shaping architecture):
- next (React + server rendering + app router)
- firebase (Realtime DB for telemetry & event logging)
- react-leaflet & leaflet (map + sensor markers)
- recharts (time-series and analytics)
- gsap (landing animations)

---

## Features
- Real‑time telemetry: live water level, soil moisture, and rainfall from deployed nodes.
- Alerts & thresholds: configurable warning/danger thresholds with event logging.
- Hardware health: battery, GSM signal, last‑seen, and component diagnostics per ESP32 node.
- Historical trends & analysis: visual correlation of rainfall vs water level and simple predictive metrics.
- Simulation / circuit preview: embedded interactive ESP32 circuit for design and field reference.

---

## Hardware architecture (brief)
- Primary MCU: ESP32-WROOM series — handles sensors, data aggregation and cellular modem communications.
- Level sensing: JSN‑SR04T ultrasonic distance sensor (millimetre-level updates described in UI).
- Communications: SIM7600 (GSM/cellular) or equivalent for remote telemetry.
- Power: solar + battery for continuous 24/7 monitoring.
- Deployment: distributed sensor nodes publish telemetry to Firebase; thresholds trigger serverless/edge notifications as configured.

---

## Code architecture (brief)
- Landing + marketing UI: components/landing (LandingPage.tsx, landing.css) implements the marketing site with tabbed sections, GSAP animations, and iframe for the circuit.
- Data integration: lib/firebase.ts initializes Firebase client (see .env.example). The app guards against missing env by checking configuration at runtime.
- UI components: small, reusable primitives (MagneticButton for interactive CTAs). Styles use Tailwind + a small local CSS override for map/leaflet styling.

How it fits together:
- ESP32 nodes push sensor telemetry to Firebase Realtime Database.
- The Next.js app reads telemetry directly in the browser via the Firebase client (lib/firebase.ts). UI components render maps, charts and alert lists and rely on realtime listeners for updates.
- Event logging and threshold breaches are persisted in Firebase for audit and trend analysis.

---
