'use client';

import { useId } from 'react';

interface CircularGaugeProps {
  value: number;
  max: number;
  unit: string;
  label: string;
  color?: 'blue' | 'teal' | 'green-yellow-red';
  size?: 'small' | 'large';
  warningLevel?: number;
  dangerLevel?: number;
}

/* ── Color palettes ──────────────────────────────────────────────────────── */

interface GaugeColor {
  bg: string;
  wave: string;
  ring: string;
  glow: string;
}

const STATUS_COLORS: Record<'normal' | 'warning' | 'danger', GaugeColor> = {
  normal:  { bg: '#0d9488', wave: '#2dd4bf', ring: '#0f766e', glow: 'rgba(13,148,136,0.35)' },
  warning: { bg: '#d97706', wave: '#fbbf24', ring: '#b45309', glow: 'rgba(217,119,6,0.35)'  },
  danger:  { bg: '#dc2626', wave: '#f87171', ring: '#b91c1c', glow: 'rgba(220,38,38,0.35)'  },
} as const;

const FIXED_COLORS: Record<'teal' | 'blue', GaugeColor> = {
  teal: { bg: '#0d9488', wave: '#2dd4bf', ring: '#0f766e', glow: 'rgba(13,148,136,0.25)'  },
  blue: { bg: '#2563eb', wave: '#60a5fa', ring: '#1d4ed8', glow: 'rgba(37,99,235,0.25)'  },
} as const;

/* ── Wave path builder ───────────────────────────────────────────────────── */

/**
 * Builds an SVG path for a sine-wave-like fill.
 * Creates `cycles` full wave cycles (each `wavelength` px wide), then closes
 * downward so the shape can be used as a liquid fill.
 * Using quadratic bezier Q commands for a smooth sine approximation.
 */
function buildWavePath(centerY: number, amplitude: number, wavelength: number, cycles = 4): string {
  const bottom = 220; // below visible SVG area — clips cleanly
  let d = `M 0,${centerY}`;
  for (let i = 0; i < cycles; i++) {
    const x = i * wavelength;
    // First half-cycle: peak above
    d += ` Q ${x + wavelength * 0.25},${centerY - amplitude} ${x + wavelength * 0.5},${centerY}`;
    // Second half-cycle: trough below
    d += ` Q ${x + wavelength * 0.75},${centerY + amplitude} ${x + wavelength},${centerY}`;
  }
  d += ` L ${cycles * wavelength},${bottom} L 0,${bottom} Z`;
  return d;
}

/* ── Component ───────────────────────────────────────────────────────────── */

export function CircularGauge({
  value,
  max,
  unit,
  label,
  color = 'teal',
  size = 'small',
  warningLevel,
  dangerLevel,
}: CircularGaugeProps) {
  // Stable ID per instance so multiple gauges don't clash on clipPath ids
  const uid = useId().replace(/:/g, '');

  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  /* ── Status & colors ── */
  let colors: GaugeColor;
  if (color === 'green-yellow-red') {
    const status =
      dangerLevel !== undefined && value >= dangerLevel ? 'danger'
      : warningLevel !== undefined && value >= warningLevel ? 'warning'
      : 'normal';
    colors = STATUS_COLORS[status];
  } else {
    colors = FIXED_COLORS[color as 'teal' | 'blue'];
  }

  /* ── Geometry ── */
  const isLarge = size === 'large';
  const CX = 100, CY = 100, R = 90;
  const WL = 200; // one wavelength = full circle width

  // waterY: 0% → 190 (bottom of circle, empty), 100% → 10 (top, full)
  const waterY = CY + R - (pct / 100) * (2 * R);

  // Two wave paths — different amplitudes for layered realism
  const pathBack  = buildWavePath(waterY, 10, WL, 4); // back layer, more pronounced
  const pathFront = buildWavePath(waterY,  6, WL, 4); // front layer, subtler

  /* ── Text contrast ── */
  // Above ~40%: text sits on colored water → white
  // Below ~40%: text sits on dark background → still white (dark bg)
  const textColor = '#ffffff';
  const unitColor = 'rgba(255,255,255,0.80)';

  const containerSize = isLarge ? 'w-56 h-56' : 'w-36 h-36';
  const valueFontSize = isLarge ? 36 : 22;
  const unitFontSize  = isLarge ? 13 : 10;
  const labelFontSize = isLarge ? 'text-base' : 'text-xs';

  const clipId   = `clip-${uid}`;
  const glowId   = `glow-${uid}`;
  const sheenId  = `sheen-${uid}`;

  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${containerSize}`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full overflow-visible"
          aria-label={`${label}: ${value.toFixed(1)} ${unit} (${Math.round(pct)}% of max)`}
          role="img"
        >
          <defs>
            {/* Circle clip — constrains water fill to circle shape */}
            <clipPath id={clipId}>
              <circle cx={CX} cy={CY} r={R - 2} />
            </clipPath>

            {/* Glow filter for the outer ring */}
            <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Glass sheen — subtle light reflection from top-left */}
            <radialGradient id={sheenId} cx="32%" cy="28%" r="55%">
              <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0"    />
            </radialGradient>
          </defs>

          {/* ── Dark glass background ── */}
          <circle cx={CX} cy={CY} r={R} fill="#0c1421" />

          {/* ── Liquid fill (clipped to circle) ── */}
          {pct > 0 && (
            <g clipPath={`url(#${clipId})`}>
              {/* Static fill below wave — solid foundation */}
              <rect
                x="0"
                y={waterY}
                width="200"
                height={200 - waterY + 20}
                fill={colors.bg}
              />

              {/* Back wave — larger amplitude, slower */}
              <path d={pathBack} fill={colors.wave} opacity="0.55">
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="0,0"
                  to={`-${WL},0`}
                  dur="4s"
                  repeatCount="indefinite"
                />
              </path>

              {/* Front wave — smaller amplitude, faster, phase-offset */}
              <path d={pathFront} fill={colors.wave} opacity="0.85">
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from={`-${WL * 0.5},0`}
                  to={`-${WL * 1.5},0`}
                  dur="2.8s"
                  repeatCount="indefinite"
                />
              </path>
            </g>
          )}

          {/* ── Glass sheen overlay ── */}
          <circle cx={CX} cy={CY} r={R - 2} fill={`url(#${sheenId})`} />

          {/* ── Outer colored ring with subtle glow ── */}
          <circle
            cx={CX} cy={CY} r={R - 1}
            fill="none"
            stroke={colors.ring}
            strokeWidth="3.5"
            opacity="0.9"
            filter={`url(#${glowId})`}
          />

          {/* ── Inner shadow ring (depth) ── */}
          <circle
            cx={CX} cy={CY} r={R - 4}
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            opacity="0.15"
          />

          {/* ── Center value text ── */}
          <text
            x={CX}
            y={CY - (isLarge ? 6 : 3)}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={textColor}
            fontSize={valueFontSize}
            fontWeight="700"
            fontFamily="'Space Grotesk', system-ui, sans-serif"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {value.toFixed(1)}
          </text>

          {/* ── Unit text ── */}
          <text
            x={CX}
            y={CY + (isLarge ? 24 : 14)}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={unitColor}
            fontSize={unitFontSize}
            fontWeight="500"
            fontFamily="'Space Grotesk', system-ui, sans-serif"
            letterSpacing="0.5"
          >
            {unit}
          </text>
        </svg>
      </div>

      {/* ── Label and percentage below gauge ── */}
      <p className={`mt-3 text-center font-semibold text-slate-700 dark:text-slate-200 ${labelFontSize}`}>
        {label}
      </p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 tabular-nums">
        {Math.round(pct)}% of max
      </p>
    </div>
  );
}
