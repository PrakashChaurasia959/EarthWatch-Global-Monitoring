import { fetchJson } from './http';
import type { UsgsFeed, UsgsFeature, UsgsMetadata, QuakeWindow } from '@/types/earthquake';
import type { NormalizedEvent } from '@/types/common';
import { windowToIsoRange } from '@/utils/date';

/** USGS summary feed URLs (ready-made GeoJSON, no params). */
const FEED_URLS: Record<Exclude<QuakeWindow, 'custom'>, string> = {
  hour: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson',
  day: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson',
  week: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson',
  month: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson',
};

const FDSN_QUERY = 'https://earthquake.usgs.gov/fdsnws/event/1/query';
const FDSN_COUNT = 'https://earthquake.usgs.gov/fdsnws/event/1/count';

/** Validate a parsed USGS feed object before using it. */
export function isUsgsFeed(v: unknown): v is UsgsFeed {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    o.type === 'FeatureCollection' &&
    Array.isArray(o.features) &&
    typeof o.metadata === 'object' &&
    o.metadata !== null
  );
}

/** Convert a USGS feature to our normalized event. */
export function normalizeUsgs(f: UsgsFeature): NormalizedEvent {
  const p = f.properties;
  const geom = f.geometry;
  const coords = geom?.coordinates;
  return {
    id: f.id ?? `${p.net}${p.code}`,
    source: 'usgs',
    category: 'earthquake',
    title: p.title ?? p.place ?? 'Unnamed earthquake',
    description: p.place ?? undefined,
    time: typeof p.time === 'number' ? p.time : null,
    longitude: coords ? coords[0] : null,
    latitude: coords ? coords[1] : null,
    magnitude: typeof p.mag === 'number' ? p.mag : null,
    magnitudeUnit: 'ml',
    depth: coords && typeof coords[2] === 'number' ? coords[2] : null,
    url: p.url || undefined,
    sourceIds: p.sources ? p.sources.split(',').filter(Boolean) : undefined,
    closed: null,
    extra: {
      type: p.type,
      alert: p.alert,
      tsunami: p.tsunami ? 'yes' : 'no',
      significance: p.sig,
      felt: p.felt,
      cdi: p.cdi,
      mmi: p.mmi,
      magType: p.magType,
      status: p.status,
      net: p.net,
      rms: p.rms,
      gap: p.gap,
    },
  };
}

/** Get earthquakes using a ready-made summary feed (hour/day/week/month). */
export async function getQuakesByFeed(
  window: QuakeWindow,
  signal?: AbortSignal,
): Promise<{ events: NormalizedEvent[]; generated: number; title: string }> {
  const url = FEED_URLS[window as Exclude<QuakeWindow, 'custom'>];
  if (!url) throw new Error(`Unsupported feed window: ${window}`);
  const feed = await fetchJson<UsgsFeed>(url, {
    signal,
    cacheTtlMs: 60_000, // 1 min cache; user can force refresh
    dedupKey: `usgs:feed:${window}`,
  });
  if (!isUsgsFeed(feed)) throw new Error('Invalid USGS feed response');
  const events = feed.features.map(normalizeUsgs).filter((e) => e.id);
  return {
    events,
    generated: feed.metadata?.generated ?? Date.now(),
    title: feed.metadata?.title ?? 'USGS Earthquakes',
  };
}

/** Flexible FDSN query for custom date ranges + minimum magnitude. */
export async function queryQuakes(
  params: { startTime: string; endTime: string; minMagnitude?: number; maxMagnitude?: number; limit?: number },
  signal?: AbortSignal,
): Promise<{ events: NormalizedEvent[]; generated: number }> {
  const u = new URL(FDSN_QUERY);
  u.searchParams.set('format', 'geojson');
  u.searchParams.set('starttime', params.startTime);
  u.searchParams.set('endtime', params.endTime);
  if (params.minMagnitude != null) u.searchParams.set('minmagnitude', String(params.minMagnitude));
  if (params.maxMagnitude != null) u.searchParams.set('maxmagnitude', String(params.maxMagnitude));
  if (params.limit != null) u.searchParams.set('limit', String(params.limit));

  const feed = await fetchJson<UsgsFeed>(u.toString(), { signal, cacheTtlMs: 60_000 });
  if (!isUsgsFeed(feed)) throw new Error('Invalid USGS FDSN response');
  return {
    events: feed.features.map(normalizeUsgs).filter((e) => e.id),
    generated: feed.metadata?.generated ?? Date.now(),
  };
}

/** Lightweight count check for the monitoring panel. */
export async function getQuakeCount(
  window: QuakeWindow,
  signal?: AbortSignal,
): Promise<number | null> {
  try {
    const { start, end } = windowToIsoRange(window);
    const u = new URL(FDSN_COUNT);
    u.searchParams.set('format', 'geojson');
    u.searchParams.set('starttime', start);
    u.searchParams.set('endtime', end);
    const text = await fetchJson<string>(u.toString(), {
      signal,
      expect: 'text',
      cacheTtlMs: 60_000,
    });
    const m = /"count"\s*:\s*(\d+)/.exec(text);
    return m ? Number(m[1]) : null;
  } catch {
    return null;
  }
}

export type { UsgsMetadata };
