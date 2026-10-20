import { fetchText } from './http';
import { FIRMS_MAP_KEY } from '@/config/env';
import type { FirmsDetection, FirmsSource } from '@/types/firms';
import type { NormalizedEvent } from '@/types/common';

/**
 * NASA FIRMS active-fire CSV API. The MAP_KEY is a usage-tracking token that
 * NASA explicitly allows in client request URLs — it is not a server-side
 * secret. We still treat its absence as "not configured" and never invent
 * fire detections.
 *
 * Endpoint: https://firms.modaps.eosdis.nasa.gov/api/area/csv/{KEY}/{SOURCE}/{west,south,east,north}/{days}/{date}
 */
const BASE = 'https://firms.modaps.eosdis.nasa.gov/api/area/csv';

/** Column order returned by the FIRMS CSV endpoint (canonical header). */
const FIRMS_COLUMNS = [
  'latitude',
  'longitude',
  'bright_ti4',
  'scan',
  'track',
  'acq_date',
  'acq_time',
  'satellite',
  'confidence',
  'vers',
  'bright_ti5',
  'frp',
  'daynight',
] as const;

export function isFirmsConfigured(): boolean {
  return FIRMS_MAP_KEY.length > 0;
}

/** Parse a FIRMS CSV body into typed detections. Tolerant of extra/missing cols. */
export function parseFirmsCsv(csv: string): FirmsDetection[] {
  const lines = csv.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  if (lines.length === 0) return [];

  // Locate the header row (FIRMS sometimes prefixes a comment/notice line).
  let headerIdx = lines.findIndex((l) => /latitude/i.test(l) && /longitude/i.test(l));
  if (headerIdx === -1) headerIdx = 0;
  const headers = lines[headerIdx].split(',').map((h) => h.trim().toLowerCase());
  const idx = (name: string): number => headers.indexOf(name);

  const out: FirmsDetection[] = [];
  for (let i = headerIdx + 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    if (cols.length < 3) continue;
    const lat = Number(cols[idx('latitude')] ?? cols[0]);
    const lon = Number(cols[idx('longitude')] ?? cols[1]);
    const latRaw = String(cols[idx('latitude')] ?? cols[0] ?? '').trim();
    const lonRaw = String(cols[idx('longitude')] ?? cols[1] ?? '').trim();
    if (latRaw.length === 0 || lonRaw.length === 0 || !Number.isFinite(lat) || !Number.isFinite(lon)) continue;

    const acqDate = String(cols[idx('acq_date')] ?? '').trim();
    const acqTime = String(cols[idx('acq_time')] ?? '').trim();
    const sat = String(cols[idx('satellite')] ?? '').trim();
    const confRaw = cols[idx('confidence')];
    const daynightRaw = String(cols[idx('daynight')] ?? '').trim();

    // Confidence may be numeric (l-norm, 0-100) or string (low/normal/high).
    let confidence: number | null = null;
    if (confRaw != null) {
      const c = String(confRaw).trim();
      if (c === 'low') confidence = 30;
      else if (c === 'normal' || c === 'nominal') confidence = 65;
      else if (c === 'high') confidence = 90;
      else if (!Number.isNaN(Number(c))) confidence = Number(c);
    }

    out.push({
      id: `firms_${acqDate}_${acqTime}_${lat.toFixed(4)}_${lon.toFixed(4)}`,
      latitude: lat,
      longitude: lon,
      brightTi4: num(cols[idx('bright_ti4')]),
      scan: num(cols[idx('scan')]),
      track: num(cols[idx('track')]),
      acqDate,
      acqTime,
      satellite: sat,
      confidence,
      brightTi5: num(cols[idx('bright_ti5')]),
      frp: num(cols[idx('frp')]),
      daynight: daynightRaw === 'N' ? 'N' : 'D',
      time: parseFirmsTime(acqDate, acqTime),
    });
  }
  return out;
}

function num(v: string | undefined): number | null {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function parseFirmsTime(date: string, time: string): number {
  if (!date) return Date.now();
  // time is HH:MM in UTC
  const hh = time.slice(0, 2).padStart(2, '0');
  const mm = time.slice(2, 4).padStart(2, '0') || '00';
  const iso = `${date}T${hh}:${mm}:00Z`;
  const ms = Date.parse(iso);
  return Number.isNaN(ms) ? Date.parse(`${date}T00:00:00Z`) || Date.now() : ms;
}

/** Convert a FIRMS detection to the common event model. */
export function normalizeFirms(d: FirmsDetection): NormalizedEvent {
  return {
    id: d.id,
    source: 'firms',
    category: 'wildfire',
    title: `Active fire detection ${d.latitude.toFixed(3)}, ${d.longitude.toFixed(3)}`,
    description: `Detected by ${d.satellite || 'satellite'}`,
    time: d.time,
    longitude: d.longitude,
    latitude: d.latitude,
    magnitude: d.frp,
    magnitudeUnit: 'MW',
    confidence: d.confidence,
    url: 'https://firms.modaps.eosdis.nasa.gov/',
    sourceIds: d.satellite ? [d.satellite] : undefined,
    extra: {
      brightTi4: d.brightTi4,
      brightTi5: d.brightTi5,
      scan: d.scan,
      track: d.track,
      daynight: d.daynight,
      acqDate: d.acqDate,
      acqTime: d.acqTime,
    },
  };
}

/**
 * Query active fire detections for a bounding box.
 * west,south,east,north in decimal degrees; days is the look-back (1-10).
 */
export async function getFires(
  params: { source: FirmsSource; bbox: { west: number; south: number; east: number; north: number }; days: number; date?: string },
  signal?: AbortSignal,
): Promise<NormalizedEvent[]> {
  if (!isFirmsConfigured()) {
    throw new Error('FIRMS not configured (VITE_FIRMS_MAP_KEY missing).');
  }
  const { source, bbox, days, date } = params;
  const area = `${bbox.west},${bbox.south},${bbox.east},${bbox.north}`;
  let url = `${BASE}/${FIRMS_MAP_KEY}/${source}/${area}/${days}`;
  if (date) url += `/${date}`;
  const csv = await fetchText(url, { signal, cacheTtlMs: 5 * 60_000 });
  const detections = parseFirmsCsv(csv);
  return detections.map(normalizeFirms);
}

export { FIRMS_COLUMNS };
