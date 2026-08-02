import { HistoryEntry } from './useFirebaseData';

export function exportToCSV(data: HistoryEntry[]) {
  if (data.length === 0) return;

  const headers = ['Timestamp', 'Date', 'Water Level (cm)', 'Rainfall (mm)'];
  const rows = data.map(entry => [
    entry.timestamp,
    new Date(entry.timestamp * 1000).toLocaleString(),
    entry.waterLevel,
    entry.rainfall
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `flood_data_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
