import { fetchJson } from './http';
import { NASA_API_KEY } from '@/config/env';
import type { ApodItem } from '@/types/nasa';

const APOD_BASE = 'https://api.nasa.gov/planetary/apod';

interface RawApod {
  title?: string;
  date?: string;
  explanation?: string;
  media_type?: string;
  url?: string;
  hdurl?: string | null;
  copyright?: string | null;
  service_version?: string;
  code?: number;
  msg?: string;
}

/** Validate and normalize a raw APOD item. */
export function normalizeApod(raw: RawApod): ApodItem {
  const mediaType: 'image' | 'video' =
    raw.media_type === 'video' ? 'video' : 'image';
  return {
    title: raw.title?.trim() || 'Untitled',
    date: raw.date ?? '',
    explanation: raw.explanation?.trim() ?? '',
    mediaType,
    url: raw.url ?? '',
    hdurl: raw.hdurl ?? null,
    copyright: raw.copyright ?? null,
    serviceVersion: raw.service_version,
  };
}

function isApod(raw: RawApod): raw is RawApod & { url: string; date: string } {
  return Boolean(raw.url) && Boolean(raw.date);
}

/** Fetch the APOD for a specific date. */
export async function getApod(date?: string, signal?: AbortSignal): Promise<ApodItem> {
  const u = new URL(APOD_BASE);
  u.searchParams.set('api_key', NASA_API_KEY);
  if (date) u.searchParams.set('date', date);
  const raw = await fetchJson<RawApod>(u.toString(), {
    signal,
    cacheTtlMs: 30 * 60_000,
    dedupKey: `apod:${date ?? 'today'}`,
  });
  if (raw && typeof raw.code === 'number' && raw.code >= 400) {
    throw new Error(`APOD API error: ${raw.msg ?? raw.code}`);
  }
  if (!isApod(raw)) throw new Error('Invalid APOD response');
  return normalizeApod(raw);
}

/** Fetch N random APOD items (great for the gallery grid). */
export async function getApodRandom(
  count: number,
  signal?: AbortSignal,
): Promise<ApodItem[]> {
  const u = new URL(APOD_BASE);
  u.searchParams.set('api_key', NASA_API_KEY);
  u.searchParams.set('count', String(count));
  const raw = await fetchJson<RawApod | RawApod[]>(u.toString(), {
    signal,
    cacheTtlMs: 30 * 60_000,
    dedupKey: `apod:random:${count}`,
  });
  const arr = Array.isArray(raw) ? raw : [raw];
  return arr
    .filter(isApod)
    .filter((r) => r.media_type === 'image' || r.media_type === 'video')
    .map(normalizeApod);
}

/** Fetch APOD items for a date range [start, end] (YYYY-MM-DD). */
export async function getApodRange(
  start: string,
  end: string,
  signal?: AbortSignal,
): Promise<ApodItem[]> {
  const u = new URL(APOD_BASE);
  u.searchParams.set('api_key', NASA_API_KEY);
  u.searchParams.set('start', start);
  u.searchParams.set('end', end);
  const raw = await fetchJson<RawApod[]>(u.toString(), {
    signal,
    cacheTtlMs: 30 * 60_000,
    dedupKey: `apod:range:${start}:${end}`,
  });
  const arr = Array.isArray(raw) ? raw : [raw];
  return arr.filter(isApod).map(normalizeApod);
}
