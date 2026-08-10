'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  exportData,
  filterByRange,
  type ExportFormat,
  type ExportField,
  type ExportRange,
} from '@/lib/exportUtils';
import type { HistoryEntry } from '@/lib/FirebaseDataContext';

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  data: HistoryEntry[];
  defaultRange?: ExportRange;
}

const RANGE_OPTIONS: { value: ExportRange; label: string }[] = [
  { value: '1h',  label: 'Last 1 hour'  },
  { value: '6h',  label: 'Last 6 hours' },
  { value: '24h', label: 'Last 24 hours'},
  { value: 'all', label: 'All data'     },
];

const FIELD_OPTIONS: { value: ExportField; label: string; sub: string }[] = [
  { value: 'timestamp',  label: 'Unix Timestamp', sub: 'Raw seconds since epoch' },
  { value: 'waterLevel', label: 'Water Level',    sub: 'cm'                       },
  { value: 'rainfall',   label: 'Rainfall',        sub: 'mm'                       },
];

const FORMAT_OPTIONS: { value: ExportFormat; label: string; icon: React.ReactNode }[] = [
  {
    value: 'csv',
    label: 'CSV',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    value: 'tsv',
    label: 'TSV',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    ),
  },
  {
    value: 'pdf',
    label: 'PDF',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export function ExportModal({ open, onClose, data, defaultRange = '6h' }: ExportModalProps) {
  const [range,  setRange]  = useState<ExportRange>(defaultRange);
  const [fields, setFields] = useState<Set<ExportField>>(
    new Set(['waterLevel', 'rainfall'])
  );
  const [format, setFormat] = useState<ExportFormat>('csv');

  // Reset to defaults whenever modal opens
  useEffect(() => {
    if (open) {
      setRange(defaultRange);
      setFields(new Set(['waterLevel', 'rainfall']));
      setFormat('csv');
    }
  }, [open, defaultRange]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const toggleField = useCallback((f: ExportField) => {
    setFields(prev => {
      const next = new Set(prev);
      next.has(f) ? next.delete(f) : next.add(f);
      return next;
    });
  }, []);

  const previewCount = filterByRange(data, range).length;
  const canExport    = fields.size > 0 && previewCount > 0;

  const handleExport = () => {
    exportData(data, { range, fields: Array.from(fields), format });
    onClose();
  };

  if (!open) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Panel */}
      <div className="
        w-full max-w-md
        bg-white dark:bg-slate-900
        rounded-2xl shadow-2xl
        border border-slate-200 dark:border-white/[0.08]
        animate-fade-in-up
        overflow-hidden
      ">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <h2 className="font-display font-semibold text-slate-900 dark:text-slate-50">Export Data</h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* ── Time range ── */}
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-muted-foreground uppercase tracking-wider mb-2">
              Time range
            </p>
            <div className="grid grid-cols-4 gap-2">
              {RANGE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setRange(opt.value)}
                  className={`
                    py-2 rounded-xl text-sm font-medium transition-all
                    ${range === opt.value
                      ? 'bg-teal-500 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/[0.10]'}
                  `}
                >
                  {opt.label.split(' ').slice(-2).join(' ')}
                </button>
              ))}
            </div>
          </div>

          {/* ── Fields ── */}
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-muted-foreground uppercase tracking-wider mb-2">
              Include fields
            </p>
            <div className="space-y-2">
              {FIELD_OPTIONS.map(opt => {
                const checked = fields.has(opt.value);
                return (
                  <button
                    key={opt.value}
                    onClick={() => toggleField(opt.value)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all
                      ${checked
                        ? 'bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800/50'
                        : 'bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] opacity-60'}
                    `}
                  >
                    <span className={`
                      w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors
                      ${checked ? 'bg-teal-500 border-teal-500' : 'border-slate-300 dark:border-slate-600'}
                    `}>
                      {checked && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    <div>
                      <p className={`text-sm font-medium ${checked ? 'text-teal-800 dark:text-teal-200' : 'text-slate-600 dark:text-slate-400'}`}>
                        {opt.label}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-muted-foreground">{opt.sub}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            {fields.size === 0 && (
              <p className="text-xs text-red-500 mt-1.5">Select at least one field</p>
            )}
          </div>

          {/* ── Format ── */}
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-muted-foreground uppercase tracking-wider mb-2">
              Format
            </p>
            <div className="grid grid-cols-3 gap-2">
              {FORMAT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setFormat(opt.value)}
                  className={`
                    flex flex-col items-center gap-1.5 py-3 rounded-xl text-sm font-medium transition-all
                    ${format === opt.value
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                      : 'bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/[0.10]'}
                  `}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
            {format === 'pdf' && (
              <p className="text-[11px] text-slate-400 dark:text-muted-foreground mt-1.5 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Opens print dialog — choose &quot;Save as PDF&quot;
              </p>
            )}
          </div>

          {/* ── Preview count ── */}
          <div className={`
            flex items-center gap-2 px-3 py-2 rounded-xl text-sm
            ${previewCount > 0
              ? 'bg-slate-50 dark:bg-white/[0.03] text-slate-600 dark:text-slate-400'
              : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'}
          `}>
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {previewCount > 0
              ? <><strong className="font-semibold tabular-nums">{previewCount}</strong> readings will be exported</>
              : 'No data in this time window'}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02]">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={!canExport}
            className="
              flex-1 py-2.5 rounded-xl text-sm font-semibold
              flex items-center justify-center gap-2
              transition-all
              disabled:opacity-40 disabled:cursor-not-allowed
              bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white shadow-sm
            "
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export {format.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
}
