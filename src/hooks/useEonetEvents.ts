import { useMemo } from 'react';
import { useAsyncData } from './useAsyncData';
import { getEvents, getCategories, getLayers } from '@/services/eonet';
import type { NormalizedEvent } from '@/types/common';
import type { EonetCategoryInfo, EonetLayerInfo } from '@/types/eonet';

export interface UseEonetEventsResult {
  events: NormalizedEvent[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
  stale: boolean;
  status: 'ok' | 'error' | 'idle' | 'loading';
  refresh: () => void;
}

/** Fetch currently-open EONET events (the active natural events feed). */
export function useEonetEvents(
  category?: string,
  status: 'open' | 'closed' | 'all' = 'open',
  limit = 500,
): UseEonetEventsResult {
  const res = useAsyncData(
    (signal) => getEvents({ category, status, limit }, signal),
    [category, status, limit],
    { autoRefreshMs: 15 * 60_000 },
  );

  const events = useMemo(() => res.data ?? [], [res.data]);

  return {
    events,
    loading: res.loading,
    error: res.error,
    lastUpdated: res.lastUpdated,
    stale: res.stale,
    status: res.status,
    refresh: res.refresh,
  };
}

export function useEonetCategories() {
  return useAsyncData<EonetCategoryInfo[]>(getCategories, [], {});
}

export function useEonetLayers() {
  return useAsyncData<EonetLayerInfo[]>(getLayers, [], {});
}
