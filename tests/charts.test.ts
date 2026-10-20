import { describe, it, expect } from 'vitest';
import { eventsByCategory, eventsTrendByDay, magnitudeBands, eventsByRegion } from '@/utils/charts';
import type { NormalizedEvent } from '@/types/common';

const NOW = Date.UTC(2026, 9, 19, 0, 0, 0);

const events: NormalizedEvent[] = [
  { id: 'q1', source: 'usgs', category: 'earthquake', title: 'a', time: NOW, longitude: -118, latitude: 37, magnitude: 3.0 },
  { id: 'q2', source: 'usgs', category: 'earthquake', title: 'b', time: NOW, longitude: -118, latitude: 37, magnitude: 5.8 },
  { id: 'q3', source: 'usgs', category: 'earthquake', title: 'c', time: NOW - 2 * 86_400_000, longitude: 13, latitude: 50, magnitude: 7.0 },
  { id: 'f1', source: 'firms', category: 'wildfire', title: 'd', time: NOW, longitude: -122, latitude: 38, magnitude: 40 },
  { id: 'e1', source: 'eonet', category: 'volcano', title: 'e', time: NOW, longitude: 14, latitude: 37, magnitude: null },
];

describe('chart transforms', () => {
  it('counts events per category, sorted by count desc', () => {
    const data = eventsByCategory(events);
    expect(data[0]).toEqual(expect.objectContaining({ category: 'earthquake', value: 3 }));
    expect(data.map((d) => d.category)).toEqual(['earthquake', 'wildfire', 'volcano']);
  });

  it('buckets earthquakes into magnitude bands', () => {
    const bands = magnitudeBands(events);
    const map = Object.fromEntries(bands.map((b) => [b.label, b.count]));
    expect(map['2.5–4.5']).toBe(1); // 3.0
    expect(map['5.5–6.5']).toBe(1); // 5.8
    expect(map['≥6.5']).toBe(1); // 7.0
  });

  it('builds a daily trend with the requested day count', () => {
    const trend = eventsTrendByDay(events, 3, NOW);
    expect(trend).toHaveLength(3);
    const today = trend[trend.length - 1];
    expect(today.earthquakes).toBe(2); // q1, q2 today (q3 is 2 days ago)
    expect(today.fires).toBe(1);
    expect(today.eonet).toBe(1);
    const twoDaysAgo = trend[0];
    expect(twoDaysAgo.earthquakes).toBe(1); // q3
  });

  it('assigns events to broad regions', () => {
    const regions = eventsByRegion(events);
    const byName = Object.fromEntries(regions.map((r) => [r.region, r.count]));
    expect(byName['North America']).toBeGreaterThanOrEqual(2); // q1, f1
    expect(byName['Europe']).toBeGreaterThanOrEqual(2); // q3, e1
  });

  it('handles empty input gracefully', () => {
    expect(eventsByCategory([])).toEqual([]);
    expect(magnitudeBands([]).every((b) => b.count === 0)).toBe(true);
    expect(eventsTrendByDay([], 5)).toHaveLength(5);
  });
});
