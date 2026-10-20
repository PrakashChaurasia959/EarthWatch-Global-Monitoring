/**
 * Common data layer: typed fetch with timeout, abort, in-memory TTL cache,
 * and graceful handling of network/HTTP errors. All service modules build on
 * this so behavior (timeouts, caching, staleness) is consistent.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  fetchedAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

export interface FetchOptions {
  /** AbortSignal from the caller; lets us cancel obsolete requests. */
  signal?: AbortSignal;
  /** Cache TTL in ms. 0 disables caching. */
  cacheTtlMs?: number;
  /** Per-request timeout in ms. */
  timeoutMs?: number;
  /** Extra headers. */
  headers?: Record<string, string>;
  /** Override the in-flight de-dup key. Defaults to the URL. */
  dedupKey?: string;
  /** Treat HTTP 4xx/5xx as JSON error body when parseable. */
  expect?: 'json' | 'text';
}

export class HttpError extends Error {
  status?: number;
  timedOut = false;
  constructor(message: string, status?: number, timedOut = false) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.timedOut = timedOut;
  }
}

function defaultTimeoutMs(): number {
  return 15000;
}

/** Fetch and parse JSON with timeout + abort + cache + de-dup. */
export async function fetchJson<T>(url: string, opts: FetchOptions = {}): Promise<T> {
  const ttl = opts.cacheTtlMs ?? 0;
  const expect = opts.expect ?? 'json';
  const dedupKey = opts.dedupKey ?? url;

  // 1) Cache hit (fresh).
  if (ttl > 0) {
    const hit = cache.get(dedupKey) as CacheEntry<T> | undefined;
    if (hit && hit.expiresAt > Date.now()) {
      return hit.value;
    }
  }

  // 2) De-duplicate concurrent identical requests.
  const existing = inflight.get(dedupKey) as Promise<T> | undefined;
  if (existing) return existing;

  const promise = (async () => {
    const controller = new AbortController();
    const timeoutMs = opts.timeoutMs ?? defaultTimeoutMs();
    const timer = setTimeout(() => controller.abort(new DOMException('timeout', 'TimeoutError')), timeoutMs);

    // If the caller's signal aborts, abort ours too.
    const onCallerAbort = () => controller.abort(opts.signal?.reason ?? 'aborted');
    if (opts.signal) {
      if (opts.signal.aborted) {
        clearTimeout(timer);
        throw new HttpError('Request aborted', undefined, false);
      }
      opts.signal.addEventListener('abort', onCallerAbort, { once: true });
    }

    try {
      const res = await fetch(url, {
        headers: { Accept: 'application/json, text/plain, */*', ...opts.headers },
        signal: controller.signal,
      });
      if (!res.ok) {
        let detail = `HTTP ${res.status}`;
        try {
          const text = await res.text();
          if (text) detail = `${detail}: ${text.slice(0, 200)}`;
        } catch {
          /* ignore body read error */
        }
        throw new HttpError(detail, res.status, false);
      }
      const data: T = expect === 'text' ? ((await res.text()) as unknown as T) : ((await res.json()) as T);
      if (ttl > 0) {
        cache.set(dedupKey, { value: data, expiresAt: Date.now() + ttl, fetchedAt: Date.now() });
      }
      return data;
    } catch (err) {
      if (err instanceof HttpError) throw err;
      if (err instanceof DOMException && err.name === 'TimeoutError') {
        throw new HttpError('Request timed out', undefined, true);
      }
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new HttpError('Request aborted', undefined, false);
      }
      // Network / CORS / DNS failures land here.
      const message = err instanceof Error ? err.message : 'Network request failed';
      throw new HttpError(message, undefined, false);
    } finally {
      clearTimeout(timer);
      if (opts.signal) opts.signal.removeEventListener('abort', onCallerAbort);
      inflight.delete(dedupKey);
    }
  })();

  inflight.set(dedupKey, promise);
  return promise;
}

/** Fetch raw text (used for FIRMS CSV). Same timeout/abort/cache behavior. */
export function fetchText(url: string, opts: FetchOptions = {}): Promise<string> {
  return fetchJson<string>(url, { ...opts, expect: 'text' });
}

/** Clear a specific cache entry, or all when no key is provided. */
export function clearCache(key?: string): void {
  if (key) cache.delete(key);
  else cache.clear();
}

/** Human-readable error message for a thrown value. */
export function describeError(err: unknown): string {
  if (err instanceof HttpError) {
    if (err.timedOut) return 'Request timed out — the data source may be slow or unreachable.';
    if (err.status && err.status >= 500) return `Upstream service error (HTTP ${err.status}).`;
    if (err.status === 429) return 'Rate limit reached for this data source. Try again shortly.';
    return err.message;
  }
  if (err instanceof Error) return err.message;
  return 'Unknown error';
}
