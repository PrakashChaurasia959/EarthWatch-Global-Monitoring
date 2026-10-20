import type { NormalizedEvent } from '@/types/common';

/**
 * Minimal, dependency-free CSV exporter. We quote fields containing commas,
 * quotes, or newlines per RFC 4180. Designed for the records currently
 * loaded in memory — we never fabricate export data.
 */
export function toCsv(rows: NormalizedEvent[]): string {
  const headers = [
    'id',
    'source',
    'category',
    'title',
    'time_iso',
    'latitude',
    'longitude',
    'magnitude',
    'magnitude_unit',
    'depth_km',
    'confidence',
    'url',
    'source_ids',
  ];

  const escape = (val: unknown): string => {
    const s = val == null ? '' : String(val);
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const lines = [headers.join(',')];
  for (const r of rows) {
    const timeIso = r.time == null ? '' : new Date(r.time).toISOString();
    const lat = r.latitude == null ? '' : String(r.latitude);
    const lon = r.longitude == null ? '' : String(r.longitude);
    const mag = r.magnitude == null ? '' : String(r.magnitude);
    const depth = r.depth == null ? '' : String(r.depth);
    const conf = r.confidence == null ? '' : String(r.confidence);
    const sourceIds = (r.sourceIds ?? []).join('|');
    lines.push(
      [
        escape(r.id),
        escape(r.source),
        escape(r.category),
        escape(r.title),
        escape(timeIso),
        escape(lat),
        escape(lon),
        escape(mag),
        escape(r.magnitudeUnit ?? ''),
        escape(depth),
        escape(conf),
        escape(r.url ?? ''),
        escape(sourceIds),
      ].join(','),
    );
  }
  return lines.join('\r\n');
}

/** Trigger a browser download of `content` as `filename`. */
export function downloadCsv(filename: string, content: string): void {
  if (typeof document === 'undefined') return;
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
