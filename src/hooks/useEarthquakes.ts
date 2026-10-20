import { useMemo } from 'react';
import { useAsyncData } from './useAsyncData';
import { getQuakesByFeed, queryQuakes } from '@/services/usgs';
import { DEFAULT_QUAKE_WINDOW } from '@/config/env';
import type { QuakeWindow } from '@/types/earthquake';
import type { NormalizedEvent } from '@/types/common';

export interface UseEarthquakesResult {
  events: NormalizedEvent[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
  stale: boolean;
  status: 'ok' | 'error' | 'idle' | 'loading';
  generated: number | null;
  refresh: () => void;
}

/**
 * Fetch recent earthquakes. Uses the prebuilt summary feeds (hour/day/week/month)
 * which are reliable and well-cached at USGS. minMagnitude filtering is done
 * client-side to avoid changing the upstream feed.
 */
export function useEarthquakes(
  window: QuakeWindow = DEFAULT_QUAKE_WINDOW,
  minMagnitude = 0,
): UseEarthquakesResult {
  const res = useAsyncData(
    (signal) => getQuakesByFeed(window, signal),
    [window],
    { autoRefreshMs: 5 * 60_000 },
  );

  const events = useMemo(
    () => (res.data?.events ?? []).filter((e) => e.magnitude == null || e.magnitude >= minMagnitude),
    [res.data, minMagnitude],
  );

  return {
    events,
    loading: res.loading,
    error: res.error,
    lastUpdated: res.lastUpdated,
    stale: res.stale,
    status: res.status,
    generated: res.data?.generated ?? null,
    refresh: res.refresh,
  };
}

export { queryQuakes };
