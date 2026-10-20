import { describe, it, expect } from 'vitest';
import {
  toIsoDate,
  parseIsoTime,
  windowToIsoRange,
  toDayBucket,
  timeAgo,
} from '@/utils/date';

describe('date utils', () => {
  it('converts epoch ms to an ISO date in UTC', () => {
    // 2026-10-19T12:00:00Z
    const ms = Date.UTC(2026, 9, 19, 12, 0, 0);
    expect(toIsoDate(ms)).toBe('2026-10-19');
  });

  it('parses ISO 8601 strings to epoch ms and returns null for garbage', () => {
    expect(parseIsoTime('2026-10-19T12:00:00Z')).toBe(Date.UTC(2026, 9, 19, 12, 0, 0));
    expect(parseIsoTime('not-a-date')).toBeNull();
    expect(parseIsoTime('')).toBeNull();
    expect(parseIsoTime(null)).toBeNull();
    expect(parseIsoTime(123)).toBe(123);
  });

  it('computes day buckets in UTC', () => {
    const ms = Date.UTC(2026, 9, 19, 23, 59, 0);
    expect(toDayBucket(ms)).toBe('2026-10-19');
    expect(toDayBucket(null)).toBe('unknown');
  });

  it('produces a 24h window range for "day"', () => {
    const now = Date.UTC(2026, 9, 19, 12, 0, 0);
    const { start, end } = windowToIsoRange('day', now);
    expect(start).toBe(new Date(Date.UTC(2026, 9, 18, 12, 0, 0)).toISOString());
    expect(end).toBe(new Date(now).toISOString());
  });

  it('produces a 7-day window range for "week"', () => {
    const now = Date.UTC(2026, 9, 19, 12, 0, 0);
    const { start } = windowToIsoRange('week', now);
    expect(start).toBe(new Date(Date.UTC(2026, 9, 12, 12, 0, 0)).toISOString());
  });

  it('formats relative time ago', () => {
    const now = 1_000_000_000_000;
    expect(timeAgo(now - 30_000, now)).toBe('30s ago');
    expect(timeAgo(now - 5 * 60_000, now)).toBe('5m ago');
    expect(timeAgo(now - 3 * 3600_000, now)).toBe('3h ago');
    expect(timeAgo(now - 2 * 86_400_000, now)).toBe('2d ago');
    expect(timeAgo(null)).toBe('—');
  });
});
