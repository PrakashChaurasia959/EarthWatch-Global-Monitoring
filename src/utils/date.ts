/** Pure date/time helpers. No external deps so they are trivially testable. */

/** Convert epoch ms to an ISO date string (YYYY-MM-DD) in UTC. */
export function toIsoDate(ms: number): string {
  const d = new Date(ms);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Format epoch ms as a localized date-time string in the user's timezone. */
export function formatDateTime(ms: number | null, timeZone?: string): string {
  if (ms == null || Number.isNaN(ms)) return '—';
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone,
    }).format(new Date(ms));
  } catch {
    return new Date(ms).toISOString();
  }
}

/** Short "time ago" relative string (e.g. "3m ago", "2h ago", "5d ago"). */
export function timeAgo(ms: number | null, now: number = Date.now()): string {
  if (ms == null) return '—';
  const diff = Math.max(0, now - ms);
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d ago`;
  const mon = Math.floor(day / 30);
  if (mon < 12) return `${mon}mo ago`;
  return `${Math.floor(mon / 12)}y ago`;
}

/** Start of "today" (UTC) in epoch ms. */
export function startOfTodayUtc(now: number = Date.now()): number {
  const d = new Date(now);
  d.setUTCHours(0, 0, 0, 0);
  return d.getTime();
}

/** Format epoch ms as YYYY-MM-DD in the user's timezone (for date pickers). */
export function toLocalDateInput(ms: number): string {
  const d = new Date(ms);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Parse an ISO 8601 string to epoch ms, returning null when invalid. */
export function parseIsoTime(value: string | number | null | undefined): number | null {
  if (value == null) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;
  const ms = Date.parse(trimmed);
  return Number.isNaN(ms) ? null : ms;
}

/**
 * Compute the [startTime, endTime] for a given USGS feed window, as ISO strings.
 * week/month are rounded to whole days in UTC.
 */
export function windowToIsoRange(window: 'hour' | 'day' | 'week' | 'month', now: number = Date.now()): {
  start: string;
  end: string;
} {
  const end = new Date(now);
  const start = new Date(now);
  switch (window) {
    case 'hour':
      start.setUTCHours(end.getUTCHours() - 1);
      break;
    case 'day':
      start.setUTCDate(end.getUTCDate() - 1);
      break;
    case 'week':
      start.setUTCDate(end.getUTCDate() - 7);
      break;
    case 'month':
      start.setUTCDate(end.getUTCDate() - 30);
      break;
  }
  return { start: start.toISOString(), end: end.toISOString() };
}

/** Bucket epoch ms into a date key (YYYY-MM-DD) for trend charts in UTC. */
export function toDayBucket(ms: number | null): string {
  if (ms == null) return 'unknown';
  return toIsoDate(ms);
}

/** The user's IANA timezone, with a sensible fallback. */
export function localTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}
