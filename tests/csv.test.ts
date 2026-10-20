import { describe, it, expect } from 'vitest';
import { toCsv } from '@/utils/csv';
import type { NormalizedEvent } from '@/types/common';

const events: NormalizedEvent[] = [
  {
    id: 'us1',
    source: 'usgs',
    category: 'earthquake',
    title: 'M 5.0, Comma, "Test" place',
    time: Date.UTC(2026, 9, 19, 12, 0, 0),
    longitude: -118.02,
    latitude: 37.42,
    magnitude: 5.0,
    magnitudeUnit: 'ml',
    depth: 4.2,
    url: 'https://example/us1',
    sourceIds: ['nn', 'us'],
  },
  {
    id: 'e1',
    source: 'eonet',
    category: 'wildfire',
    title: 'Wildfire event',
    time: null,
    longitude: null,
    latitude: null,
    magnitude: null,
  },
];

describe('CSV export', () => {
  it('produces a header row and one line per event', () => {
    const csv = toCsv(events);
    const lines = csv.split('\r\n');
    expect(lines[0]).toContain('id,source,category,title');
    expect(lines).toHaveLength(1 + events.length);
  });

  it('quotes fields containing commas, quotes, or newlines per RFC 4180', () => {
    const csv = toCsv(events);
    // The first title contains a comma and quotes -> must be wrapped and doubled.
    expect(csv).toContain('"M 5.0, Comma, ""Test"" place"');
  });

  it('emits ISO timestamps and empty cells for missing values', () => {
    const csv = toCsv(events);
    // Second event has null coords/time -> empty latitude/longitude cells.
    const lines = csv.split('\r\n');
    const eonetLine = lines.find((l) => l.startsWith('e1,'));
    expect(eonetLine).toBeTruthy();
    expect(eonetLine).toContain('e1,eonet,wildfire,Wildfire event,,,,');
  });

  it('joins source ids with a pipe', () => {
    const csv = toCsv(events);
    expect(csv).toContain('nn|us');
  });

  it('exports zero rows as just a header', () => {
    expect(toCsv([]).split('\r\n')).toHaveLength(1);
  });
});
