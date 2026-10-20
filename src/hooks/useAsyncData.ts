import { useCallback, useEffect, useRef, useState } from 'react';
import { describeError } from '@/services/http';

export interface UseAsyncDataOptions {
  /** Re-run this many ms after the last successful fetch. 0 disables. */
  autoRefreshMs?: number;
  /** Skip the very first automatic fetch (useful for manual-only flows). */
  manual?: boolean;
}

export interface UseAsyncResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
  stale: boolean;
  status: 'ok' | 'error' | 'idle' | 'loading';
  refresh: () => void;
}

/**
 * Drives a fetcher with proper AbortController lifecycle, keeps the last
 * successful data during a failed refresh (marking it stale), and supports
 * manual refresh + optional periodic auto-refresh.
 */
export function useAsyncData<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: unknown[],
  options: UseAsyncDataOptions = {},
): UseAsyncResult<T> {
  const { autoRefreshMs = 0, manual = false } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(!manual);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [stale, setStale] = useState(false);
  const [status, setStatus] = useState<'ok' | 'error' | 'idle' | 'loading'>(
    manual ? 'idle' : 'loading',
  );

  // Keep the latest fetcher in a ref so changing identity doesn't refetch.
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);
  const lastUpdatedRef = useRef<number | null>(null);
  lastUpdatedRef.current = lastUpdated;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, []);

  const run = useCallback(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setStatus('loading');
    fetcherRef
      .current(controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        if (!mountedRef.current) return;
        setData(result);
        setError(null);
        setStale(false);
        setLastUpdated(Date.now());
        setStatus('ok');
      })
      .catch((err) => {
        if (controller.signal.aborted) return; // obsolete request
        if (!mountedRef.current) return;
        // Preserve previous successful data, but mark stale.
        setError(describeError(err));
        if (lastUpdatedRef.current) {
          setStale(true);
          setStatus('ok');
        } else {
          setStatus('error');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted && mountedRef.current) {
          setLoading(false);
        }
      });
  }, []);

  // Re-fetch when deps change (or on mount, unless manual).
  useEffect(() => {
    if (manual) {
      setStatus('idle');
      setLoading(false);
      return;
    }
    run();
    return () => {
      abortRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // Periodic auto-refresh.
  useEffect(() => {
    if (autoRefreshMs <= 0) return;
    const id = window.setInterval(() => run(), autoRefreshMs);
    return () => window.clearInterval(id);
  }, [autoRefreshMs, run]);

  return { data, loading, error, lastUpdated, stale, status, refresh: run };
}
