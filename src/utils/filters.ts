import type { NormalizedEvent, EventCategory } from '@/types/common';

export type SortField = 'time' | 'magnitude';
export type SortDir = 'asc' | 'desc';

export interface EventFilters {
  query: string;
  categories: EventCategory[]; // empty = all
  minMagnitude: number;
  sortField: SortField;
  sortDir: SortDir;
  sinceMs: number | null; // only events at/after this time (null = any)
}

export const DEFAULT_FILTERS: EventFilters = {
  query: '',
  categories: [],
  minMagnitude: 0,
  sortField: 'time',
  sortDir: 'desc',
  sinceMs: null,
};

function matchesQuery(e: NormalizedEvent, q: string): boolean {
  if (!q) return true;
  const hay = `${e.title} ${e.description ?? ''}`.toLowerCase();
  return hay.includes(q);
}

/** Apply text/category/magnitude/time filters then sort. Pure + testable. */
export function applyEventFilters(events: NormalizedEvent[], f: EventFilters): NormalizedEvent[] {
  const q = f.query.trim().toLowerCase();
  let out = events.filter((e) => {
    if (!matchesQuery(e, q)) return false;
    if (f.categories.length > 0 && !f.categories.includes(e.category)) return false;
    if (e.source === 'usgs' && e.magnitude != null && e.magnitude < f.minMagnitude) return false;
    if (f.sinceMs != null && (e.time ?? 0) < f.sinceMs) return false;
    return true;
  });

  const dir = f.sortDir === 'asc' ? 1 : -1;
  out = [...out].sort((a, b) => {
    if (f.sortField === 'magnitude') {
      return ((a.magnitude ?? -Infinity) - (b.magnitude ?? -Infinity)) * dir;
    }
    return ((a.time ?? -Infinity) - (b.time ?? -Infinity)) * dir;
  });
  return out;
}

/** Toggle a category in the filter set, returning a new array. */
export function toggleCategory(list: EventCategory[], cat: EventCategory): EventCategory[] {
  return list.includes(cat) ? list.filter((c) => c !== cat) : [...list, cat];
}
