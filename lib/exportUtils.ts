import { HistoryEntry, Thresholds } from './useFirebaseData';

export type ExportFormat = 'csv' | 'tsv' | 'pdf';
export type ExportField  = 'timestamp' | 'waterLevel' | 'rainfall';
export type ExportRange  = '1h' | '6h' | '24h' | 'all';

export interface ExportOptions {
  range:  ExportRange;
  fields: ExportField[];
  format: ExportFormat;
}

/* ── Time filtering ──────────────────────────────────────────────────────── */

export function filterByRange(data: HistoryEntry[], range: ExportRange): HistoryEntry[] {
  if (range === 'all' || data.length === 0) return data;
  const latestTs = data[data.length - 1].timestamp;
  const rangeSec: Record<Exclude<ExportRange, 'all'>, number> = {
    '1h':   1 * 60 * 60,
    '6h':   6 * 60 * 60,
    '24h': 24 * 60 * 60,
  };
  return data.filter(h => latestTs - h.timestamp <= rangeSec[range]);
}

/* ── Column helpers ──────────────────────────────────────────────────────── */

const FIELD_LABELS: Record<ExportField, string> = {
  timestamp:  'Timestamp (Unix)',
  waterLevel: 'Water Level (cm)',
  rainfall:   'Rainfall (mm)',
};

function buildRows(data: HistoryEntry[], fields: ExportField[]): string[][] {
  const headers = [
    'Date / Time',
    ...fields.map(f => FIELD_LABELS[f]),
  ];
  const rows = data.map(entry => [
    new Date(entry.timestamp * 1000).toLocaleString(),
    ...fields.map(f => {
      if (f === 'timestamp')  return String(entry.timestamp);
      if (f === 'waterLevel') return entry.waterLevel.toFixed(2);
      if (f === 'rainfall')   return entry.rainfall.toFixed(2);
      return '';
    }),
  ]);
  return [headers, ...rows];
}

/* ── Download helper ─────────────────────────────────────────────────────── */

function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ── CSV ─────────────────────────────────────────────────────────────────── */

function exportCSV(rows: string[][], dateStr: string) {
  const content = rows.map(r => r.map(cell => `"${cell}"`).join(',')).join('\n');
  downloadBlob(content, `levee_data_${dateStr}.csv`, 'text/csv;charset=utf-8;');
}

/* ── TSV ─────────────────────────────────────────────────────────────────── */

function exportTSV(rows: string[][], dateStr: string) {
  const content = rows.map(r => r.join('\t')).join('\n');
  downloadBlob(content, `levee_data_${dateStr}.tsv`, 'text/tab-separated-values;charset=utf-8;');
}

/* ── PDF (browser print) ─────────────────────────────────────────────────── */

function exportPDF(data: HistoryEntry[], fields: ExportField[], dateStr: string, range: ExportRange, thresholds?: Thresholds | null) {
  const rangeLabel: Record<ExportRange, string> = {
    '1h': 'Last 1 Hour', '6h': 'Last 6 Hours',
    '24h': 'Last 24 Hours', 'all': 'All Data',
  };

  // Compute stats
  let peakWater = 0;
  let totalWater = 0;
  data.forEach(d => {
    if (d.waterLevel > peakWater) peakWater = d.waterLevel;
    totalWater += d.waterLevel;
  });
  const avgWater = data.length > 0 ? (totalWater / data.length).toFixed(1) : '0';
  const peakStr = peakWater.toFixed(1);

  const headers = ['Date / Time', ...fields.map(f => FIELD_LABELS[f])];
  const headerHtml = headers.map(h => `<th>${h}</th>`).join('');

  const tableRows = data.map(entry => {
    const isDanger = thresholds?.danger && entry.waterLevel >= thresholds.danger;
    const isWarning = !isDanger && thresholds?.warning && entry.waterLevel >= thresholds.warning;
    
    const trClass = isDanger ? 'row-danger' : (isWarning ? 'row-warning' : '');
    
    const dateCell = `<td>${new Date(entry.timestamp * 1000).toLocaleString()}</td>`;
    const fieldCells = fields.map(f => {
      if (f === 'timestamp') return `<td>${entry.timestamp}</td>`;
      if (f === 'waterLevel') return `<td>${entry.waterLevel.toFixed(2)}</td>`;
      if (f === 'rainfall') return `<td>${entry.rainfall.toFixed(2)}</td>`;
      return '<td></td>';
    }).join('');

    return `<tr class="${trClass}">${dateCell}${fieldCells}</tr>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html><head>
  <meta charset="utf-8"/>
  <title>Levee Incident Report — ${dateStr}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 11px; color: #1e293b; padding: 40px; line-height: 1.5; }
    
    /* Header Block */
    .report-header { border-bottom: 2px solid #0f766e; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }
    .report-title h1 { font-size: 24px; font-weight: 800; color: #0f766e; margin-bottom: 4px; letter-spacing: -0.02em; }
    .report-title p { font-size: 13px; color: #64748b; font-weight: 500; }
    .report-meta { text-align: right; color: #64748b; font-size: 11px; }
    .report-meta strong { color: #334155; }

    /* Summary Stats */
    .stats-container { display: flex; gap: 16px; margin-bottom: 24px; }
    .stat-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; flex: 1; }
    .stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 4px; font-weight: 600; }
    .stat-value { font-size: 18px; font-weight: 700; color: #0f766e; }
    .stat-value.danger { color: #e11d48; }
    .stat-value.warning { color: #d97706; }

    /* Table */
    table { width: 100%; border-collapse: collapse; margin-bottom: 32px; font-variant-numeric: tabular-nums; }
    thead tr { background: #f1f5f9; border-top: 1px solid #cbd5e1; border-bottom: 2px solid #cbd5e1; }
    th { text-align: left; padding: 8px 12px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; font-weight: 600; }
    td { padding: 6px 12px; border-bottom: 1px solid #f1f5f9; color: #334155; }
    
    /* Highlight Rows */
    tr.row-warning td { background: #fffbeb; border-bottom: 1px solid #fde68a; color: #92400e; font-weight: 500; }
    tr.row-danger td { background: #fff1f2; border-bottom: 1px solid #fecdd3; color: #be123c; font-weight: 600; }
    
    /* Print optimizations */
    @media print {
      body { padding: 0; }
      @page { margin: 1.5cm; }
      thead { display: table-header-group; }
      tr { page-break-inside: avoid; }
    }
  </style>
</head><body>
  
  <div class="report-header">
    <div class="report-title">
      <h1>Levee Monitoring Report</h1>
      <p>Station Alpha — Flood Early Warning System</p>
    </div>
    <div class="report-meta">
      <p>Date: <strong>${new Date().toLocaleDateString()}</strong></p>
      <p>Time Range: <strong>${rangeLabel[range]}</strong></p>
    </div>
  </div>

  <div class="stats-container">
    <div class="stat-box">
      <div class="stat-label">Total Readings</div>
      <div class="stat-value" style="color: #334155;">${data.length}</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Average Water Level</div>
      <div class="stat-value">${avgWater} cm</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Peak Water Level</div>
      <div class="stat-value ${thresholds?.danger && peakWater >= thresholds.danger ? 'danger' : (thresholds?.warning && peakWater >= thresholds.warning ? 'warning' : '')}">${peakStr} cm</div>
    </div>
  </div>

  <table>
    <thead><tr>${headerHtml}</tr></thead>
    <tbody>${tableRows}</tbody>
  </table>

</body></html>`;

  const w = window.open('', '_blank', 'width=900,height=700');
  if (!w) return;
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => { w.print(); w.close(); }, 300);
}

/* ── Main export function ────────────────────────────────────────────────── */

export function exportData(data: HistoryEntry[], options: ExportOptions, thresholds?: Thresholds | null) {
  const { range, fields, format } = options;
  if (fields.length === 0) return;
  const filtered = filterByRange(data, range);
  if (filtered.length === 0) return;
  
  const dateStr = new Date().toISOString().split('T')[0];
  
  if (format === 'csv' || format === 'tsv') {
    const rows = buildRows(filtered, fields);
    if (format === 'csv') exportCSV(rows, dateStr);
    if (format === 'tsv') exportTSV(rows, dateStr);
  }
  
  if (format === 'pdf') {
    exportPDF(filtered, fields, dateStr, range, thresholds);
  }
}

/* ── Legacy quick-export (Overview header button) ────────────────────────── */

export function exportToCSV(data: HistoryEntry[]) {
  exportData(data, { range: 'all', fields: ['timestamp', 'waterLevel', 'rainfall'], format: 'csv' });
}

