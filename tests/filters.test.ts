import { describe, it, expect } from 'vitest';
import { applyEventFilters, DEFAULT_FILTERS, toggleCategory } from '@/utils/filters';
import type { NormalizedEvent } from '@/types/common';

const events: NormalizedEvent[] = [
  { id: 'q1', source: 'usgs', category: 'earthquake', title: 'Nevada quake', time: 1000, longitude: -118, latitude: 37, magnitude: 3.2 },
  { id: 'q2', source: 'usgs', category: 'earthquake', title: 'Big Alaska event', time: 2000, longitude: -150, latitude: 61, magnitude: 6.8 },
  { id: 'f1', source: 'firms', category: 'wildfire', title: 'California fire', time: 3000, longitude: -122, latitude: 38, magnitude: 40 },
  { id: 'e1', source: 'eonet', category: 'volcano', title: 'Etna eruption', time: 4000, longitude: 14, latitude: 37, magnitude: null },
];

describe('event filters', () => {
  it('returns all events with default filters sorted by time desc', () => {
    const out = applyEventFilters(events, DEFAULT_FILTERS);
    expect(out.map((e) => e.id)).toEqual(['e1', 'f1', 'q2', 'q1']);
  });

  it('filters by text query (case-insensitive, title+description)', () => {
    const out = applyEventFilters(events, { ...DEFAULT_FILTERS, query: 'alaska' });
    expect(out.map((e) => e.id)).toEqual(['q2']);
  });

  it('filters by category', () => {
    const out = applyEventFilters(events, { ...DEFAULT_FILTERS, categories: ['wildfire', 'volcano'] });
    expect(out.map((e) => e.id)).toEqual(['e1', 'f1']);
  });

  it('applies minimum magnitude only to earthquakes', () => {
    const out = applyEventFilters(events, { ...DEFAULT_FILTERS, minMagnitude: 5 });
    // q2 (6.8) passes; q1 (3.2) is excluded; firms/eonet magnitudes are not filtered.
    expect(out.map((e) => e.id)).toEqual(['e1', 'f1', 'q2']);
  });

  it('filters by sinceMs time window', () => {
    const out = applyEventFilters(events, { ...DEFAULT_FILTERS, sinceMs: 2500, sortField: 'time', sortDir: 'asc' });
    expect(out.map((e) => e.id)).toEqual(['f1', 'e1']);
  });

  it('sorts by magnitude desc', () => {
    const out = applyEventFilters(events, { ...DEFAULT_FILTERS, sortField: 'magnitude', sortDir: 'desc' });
    // f1 fire FRP (40) is highest, then q2 (6.8), q1 (3.0); e1 has null magnitude.
    expect(out.map((e) => e.id)).toEqual(['f1', 'q2', 'q1', 'e1']);
  });

  it('sorts by time asc', () => {
    const out = applyEventFilters(events, { ...DEFAULT_FILTERS, sortField: 'time', sortDir: 'asc' });
    expect(out.map((e) => e.id)).toEqual(['q1', 'q2', 'f1', 'e1']);
  });

  it('toggleCategory adds/removes a category', () => {
    expect(toggleCategory([], 'wildfire')).toEqual(['wildfire']);
    expect(toggleCategory(['wildfire'], 'wildfire')).toEqual([]);
    expect(toggleCategory(['volcano'], 'wildfire')).toEqual(['volcano', 'wildfire']);
  });

  it('returns zero results when nothing matches', () => {
    const out = applyEventFilters(events, { ...DEFAULT_FILTERS, query: 'zzznotfound' });
    expect(out).toEqual([]);
  });
});
