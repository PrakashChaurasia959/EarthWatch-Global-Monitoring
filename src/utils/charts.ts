import type { NormalizedEvent } from '@/types/common';
import { categoryLabel, ALL_CATEGORIES, categoryColor } from '@/utils/categories';
import { toDayBucket, parseIsoTime } from '@/utils/date';

export interface CategorySlice {
  category: string;
  label: string;
  value: number;
  color: string;
}

/** Count events per category, preserving a stable display order. */
export function eventsByCategory(events: NormalizedEvent[]): CategorySlice[] {
  const counts = new Map<string, number>();
  for (const e of events) counts.set(e.category, (counts.get(e.category) ?? 0) + 1);
  return ALL_CATEGORIES.filter((c) => counts.has(c))
    .map((c) => ({
      category: c,
      label: categoryLabel(c),
      value: counts.get(c) ?? 0,
      color: categoryColor(c),
    }))
    .sort((a, b) => b.value - a.value);
}

export interface TrendPoint {
  bucket: string;
  earthquakes: number;
  fires: number;
  eonet: number;
  total: number;
}

/** Bucket events into UTC day buckets for trend lines. Pass `now` for deterministic tests. */
export function eventsTrendByDay(events: NormalizedEvent[], days: number = 14, now: number = Date.now()): TrendPoint[] {
  const buckets: TrendPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const start = new Date(now);
    start.setUTCDate(start.getUTCDate() - i);
    start.setUTCHours(0, 0, 0, 0);
    const bucket = start.toISOString().slice(0, 10);
    buckets.push({ bucket, earthquakes: 0, fires: 0, eonet: 0, total: 0 });
  }
  const index = new Map(buckets.map((b) => [b.bucket, b]));

  for (const e of events) {
    const t = e.time ?? parseIsoTime(e.time);
    if (t == null) continue;
    const bucket = toDayBucket(t);
    const row = index.get(bucket);
    if (!row) continue;
    if (e.source === 'usgs') row.earthquakes += 1;
    else if (e.source === 'firms') row.fires += 1;
    else row.eonet += 1;
    row.total += 1;
  }
  return buckets;
}

/** Earthquake magnitude bands summary for analytics. */
export function magnitudeBands(events: NormalizedEvent[]): { label: string; count: number }[] {
  const quakes = events.filter((e) => e.source === 'usgs' && e.magnitude != null);
  const bands = [
    { label: '<2.5', min: -Infinity, max: 2.5 },
    { label: '2.5–4.5', min: 2.5, max: 4.5 },
    { label: '4.5–5.5', min: 4.5, max: 5.5 },
    { label: '5.5–6.5', min: 5.5, max: 6.5 },
    { label: '≥6.5', min: 6.5, max: Infinity },
  ];
  return bands.map((b) => ({
    label: b.label,
    count: quakes.filter((e) => e.magnitude != null && e.magnitude >= b.min && e.magnitude < b.max).length,
  }));
}

/** Regional summary — rough continent bucketing by longitude/latitude. */
export interface RegionCount {
  region: string;
  count: number;
  lon: number;
  lat: number;
}

const REGIONS = [
  { region: 'North America', lon: -100, lat: 45, box: { lon: [-170, -50], lat: [14, 84] } },
  { region: 'South America', lon: -60, lat: -15, box: { lon: [-82, -34], lat: [-56, 13] } },
  { region: 'Europe', lon: 15, lat: 50, box: { lon: [-10, 40], lat: [36, 72] } },
  { region: 'Africa', lon: 20, lat: 0, box: { lon: [-20, 52], lat: [-35, 38] } },
  { region: 'Asia', lon: 90, lat: 40, box: { lon: [40, 150], lat: [5, 75] } },
  { region: 'Oceania', lon: 135, lat: -25, box: { lon: [110, 180], lat: [-50, 0] } },
  { region: 'Antarctica', lon: 0, lat: -80, box: { lon: [-180, 180], lat: [-90, -60] } },
  { region: 'Arctic', lon: 0, lat: 80, box: { lon: [-180, 180], lat: [72, 90] } },
];

export function eventsByRegion(events: NormalizedEvent[]): RegionCount[] {
  const counts = new Map<string, number>();
  for (const r of REGIONS) counts.set(r.region, 0);
  for (const e of events) {
    if (e.longitude == null || e.latitude == null) continue;
    for (const r of REGIONS) {
      const inLon = e.longitude >= r.box.lon[0] && e.longitude <= r.box.lon[1];
      const inLat = e.latitude >= r.box.lat[0] && e.latitude <= r.box.lat[1];
      if (inLon && inLat) {
        counts.set(r.region, (counts.get(r.region) ?? 0) + 1);
        break;
      }
    }
  }
  return REGIONS.map((r) => ({ region: r.region, lon: r.lon, lat: r.lat, count: counts.get(r.region) ?? 0 })).filter(
    (r) => r.count > 0,
  );
}
