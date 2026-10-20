import { fetchJson } from './http';
import type {
  EonetEvent,
  EonetEventsResponse,
  EonetCategoryListResponse,
  EonetLayersResponse,
  EonetCategoryInfo,
  EonetLayerInfo,
} from '@/types/eonet';
import type { NormalizedEvent } from '@/types/common';
import { eonetCategoryToEvent } from '@/utils/categories';
import { latestPointFromGeometries } from '@/utils/geo';
import { parseIsoTime } from '@/utils/date';

const BASE = 'https://eonet.gsfc.nasa.gov/api/v3';

/** Validate an EONET events response. */
export function isEonetEventsResponse(v: unknown): v is EonetEventsResponse {
  return typeof v === 'object' && v !== null && Array.isArray((v as EonetEventsResponse).events);
}

/** Normalize an EONET event to our common model. */
export function normalizeEonet(e: EonetEvent): NormalizedEvent {
  const primaryCat = e.categories[0];
  const category = primaryCat ? eonetCategoryToEvent(primaryCat.id) : 'other';
  const { point, date } = latestPointFromGeometries(e.geometry);
  const geom0 = e.geometry[0];
  const magnitudeValue = geom0?.magnitudeValue ?? null;
  const magnitudeUnit = geom0?.magnitudeUnit ?? null;

  return {
    id: e.id,
    source: 'eonet',
    category,
    title: e.title,
    description: e.description || undefined,
    time: parseIsoTime(date),
    longitude: point ? point[0] : null,
    latitude: point ? point[1] : null,
    magnitude: magnitudeValue,
    magnitudeUnit,
    url: e.link || undefined,
    sourceIds: e.sources.map((s) => s.id).filter(Boolean),
    closed: e.closed ? true : null,
    extra: {
      categoryTitle: primaryCat?.title,
      geometries: e.geometry.length,
      sources: e.sources.map((s) => s.id).join(', '),
      closedDate: e.closed ?? undefined,
    },
  };
}

/** Fetch EONET events with optional category/status/limit filters. */
export async function getEvents(
  params: { category?: string; status?: 'open' | 'closed' | 'all'; limit?: number } = {},
  signal?: AbortSignal,
): Promise<NormalizedEvent[]> {
  const u = new URL(`${BASE}/events`);
  if (params.category) u.searchParams.set('category', params.category);
  if (params.status) u.searchParams.set('status', params.status);
  u.searchParams.set('limit', String(params.limit ?? 500));
  const res = await fetchJson<EonetEventsResponse>(u.toString(), {
    signal,
    cacheTtlMs: 5 * 60_000, // 5 min cache
    dedupKey: `eonet:events:${params.category ?? 'all'}:${params.status ?? 'all'}:${params.limit ?? 500}`,
  });
  if (!isEonetEventsResponse(res)) throw new Error('Invalid EONET events response');
  return res.events.map(normalizeEonet).filter((e) => e.id);
}

/** Fetch the list of EONET categories. */
export async function getCategories(signal?: AbortSignal): Promise<EonetCategoryInfo[]> {
  const res = await fetchJson<EonetCategoryListResponse>(`${BASE}/categories`, {
    signal,
    cacheTtlMs: 24 * 60 * 60_000,
  });
  return res.categories ?? [];
}

/** Fetch the list of EONET layers (used for the WMTS imagery mapping). */
export async function getLayers(signal?: AbortSignal): Promise<EonetLayerInfo[]> {
  const res = await fetchJson<EonetLayersResponse>(`${BASE}/layers`, {
    signal,
    cacheTtlMs: 24 * 60 * 60_000,
  });
  return res.layers ?? [];
}

export type { EonetEvent, EonetCategoryInfo, EonetLayerInfo };
