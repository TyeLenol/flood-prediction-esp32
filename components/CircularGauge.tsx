'use client';

import { useEffect, useState } from 'react';

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

export function CircularGauge({
  value,
  max,
  unit,
  label,
  color = 'blue',
  size = 'small',
  warningLevel,
  dangerLevel,
}: CircularGaugeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const percentage = Math.min((value / max) * 100, 100);

  // Determine color based on thresholds for water level gauge
  let arcColor = 'hsl(217, 91%, 60%)'; // blue default
  if (color === 'green-yellow-red' && warningLevel !== undefined && dangerLevel !== undefined) {
    if (value >= dangerLevel) {
      arcColor = 'hsl(0, 84%, 60%)'; // red
    } else if (value >= warningLevel) {
      arcColor = 'hsl(38, 92%, 50%)'; // yellow
    } else {
      arcColor = 'hsl(134, 61%, 41%)'; // green
    }
  } else if (color === 'teal') {
    arcColor = 'hsl(174, 75%, 44%)'; // teal
  }

  const isLarge = size === 'large';
  const circumference = isLarge ? 564 : 314;
  const radius = isLarge ? 90 : 50;
  const strokeWidth = isLarge ? 12 : 8;
  const offset = circumference - (percentage / 100) * circumference;

  const viewBoxSize = isLarge ? 200 : 120;
  const centerX = isLarge ? 100 : 60;
  const centerY = isLarge ? 100 : 60;

  const getStatusEffect = () => {
    if (!isLarge || color !== 'green-yellow-red') return null;
    if (value >= (dangerLevel || 0)) return 'animate-pulse text-red-500/20';
    if (value >= (warningLevel || 0)) return 'animate-ping text-yellow-500/10';
    return 'animate-[pulse_3s_infinite] text-blue-500/5';
  };

  const statusEffect = getStatusEffect();

  return (
    <div className="flex flex-col items-center">
      <div className="relative inline-flex items-center justify-center">
        {/* Ripple Effect Background */}
        {isLarge && statusEffect && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-40 h-40 rounded-full bg-current ${statusEffect}`} />
            <div className={`w-32 h-32 rounded-full bg-current ${statusEffect.replace('3s', '4s')}`} />
          </div>
        )}
        {/* SVG Gauge */}
        <svg
          width={viewBoxSize}
          height={viewBoxSize}
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="rgba(100, 116, 139, 0.2)"
            strokeWidth={strokeWidth}
          />

          {/* Threshold lines for water level gauge */}
          {color === 'green-yellow-red' && warningLevel !== undefined && dangerLevel !== undefined && (
            <>
              {/* Warning level indicator */}
              <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke="rgba(250, 204, 21, 0.3)"
                strokeWidth={2}
                strokeDasharray={`${((warningLevel / max) / 100 * circumference)} ${circumference}`}
              />
              {/* Danger level indicator */}
              <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke="rgba(239, 68, 68, 0.3)"
                strokeWidth={2}
                strokeDasharray={`${((dangerLevel / max) / 100 * circumference)} ${circumference}`}
              />
            </>
          )}

          {/* Progress arc */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke={arcColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={mounted ? 'transition-all duration-700 ease-out' : ''}
            style={{
              filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.1))',
            }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute flex flex-col items-center">
          <div className={isLarge ? 'text-4xl font-bold' : 'text-2xl font-bold'}>
            {mounted ? value.toFixed(1) : '—'}
          </div>
          <div className={isLarge ? 'text-xs text-slate-500' : 'text-xs text-slate-500'}>
            {unit}
          </div>
        </div>
      </div>

      {/* Label */}
      <p className={`mt-4 text-center font-semibold ${isLarge ? 'text-lg' : 'text-sm'}`}>
        {label}
      </p>

      {/* Percentage indicator */}
      <p className="text-xs text-slate-500 mt-1">{Math.round(percentage)}%</p>
    </div>
  );
}
