import { useMemo } from 'react';
import { useAsyncData } from './useAsyncData';
import { getFires, isFirmsConfigured } from '@/services/firms';
import { DEFAULT_FIRMS_SOURCE } from '@/config/env';
import type { FirmsSource } from '@/types/firms';
import type { NormalizedEvent } from '@/types/common';

export interface UseFiresResult {
  events: NormalizedEvent[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
  stale: boolean;
  status: 'ok' | 'error' | 'idle' | 'loading';
  configured: boolean;
  refresh: () => void;
}

interface Bbox {
  west: number;
  south: number;
  east: number;
  north: number;
}

const WORLD_BBOX: Bbox = { west: -180, south: -60, east: 180, north: 60 };

/**
 * Fetch near-real-time active fire detections from NASA FIRMS. When the
 * MAP_KEY is not configured, the hook returns a status of 'idle' and
 * configured=false so the UI can show a setup notice instead of fake data.
 */
export function useFires(
  source: FirmsSource = DEFAULT_FIRMS_SOURCE,
  days = 1,
  bbox: Bbox = WORLD_BBOX,
): UseFiresResult {
  const configured = isFirmsConfigured();
  const res = useAsyncData(
    (signal) => getFires({ source, bbox, days }, signal),
    [source, days, bbox.west, bbox.south, bbox.east, bbox.north, configured],
    { autoRefreshMs: 15 * 60_000, manual: !configured },
  );

  const events = useMemo(() => res.data ?? [], [res.data]);

  return {
    events,
    loading: res.loading,
    error: res.error,
    lastUpdated: res.lastUpdated,
    stale: res.stale,
    status: configured ? res.status : 'idle',
    configured,
    refresh: res.refresh,
  };
}

export { WORLD_BBOX };
export type { Bbox };
