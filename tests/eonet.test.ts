import { describe, it, expect } from 'vitest';
import { isEonetEventsResponse, normalizeEonet } from '@/services/eonet';
import type { EonetEvent, EonetEventsResponse } from '@/types/eonet';

const multiGeomEvent: EonetEvent = {
  id: 'EONET_25340',
  title: 'Tropical Cyclone Wati',
  description: '',
  link: 'https://eonet.gsfc.nasa.gov/api/v3/events/EONET_25340',
  categories: [{ id: 'severeStorms', title: 'Severe Storms', link: 'x' }],
  sources: [{ id: 'JTWC', url: 'https://example' }],
  geometry: [
    { type: 'Point', date: '2026-10-16T06:00:00Z', coordinates: [-163.3, -10.8], magnitudeValue: 45, magnitudeUnit: 'kts' },
    { type: 'Point', date: '2026-10-17T06:00:00Z', coordinates: [-160, -12], magnitudeValue: 50, magnitudeUnit: 'kts' },
  ],
};

const noCoordEvent: EonetEvent = {
  id: 'EONET_1',
  title: 'Some event with no geometry',
  link: 'x',
  categories: [{ id: 'drought', title: 'Drought', link: 'x' }],
  sources: [],
  geometry: [],
};

const sampleResponse: EonetEventsResponse = { events: [multiGeomEvent, noCoordEvent] };

describe('EONET service', () => {
  it('validates an EONET events response', () => {
    expect(isEonetEventsResponse(sampleResponse)).toBe(true);
    expect(isEonetEventsResponse({ events: 'no' })).toBe(false);
    expect(isEonetEventsResponse(null)).toBe(false);
  });

  it('normalizes a multi-geometry event, using the first usable point', () => {
    const n = normalizeEonet(multiGeomEvent);
    expect(n.id).toBe('EONET_25340');
    expect(n.source).toBe('eonet');
    expect(n.category).toBe('severeStorms');
    expect(n.longitude).toBe(-163.3);
    expect(n.latitude).toBe(-10.8);
    expect(n.magnitude).toBe(45);
    expect(n.magnitudeUnit).toBe('kts');
    expect(n.sourceIds).toEqual(['JTWC']);
    expect(n.time).toBe(Date.parse('2026-10-16T06:00:00Z'));
  });

  it('handles events with no geometry (coords null, time null)', () => {
    const n = normalizeEonet(noCoordEvent);
    expect(n.longitude).toBeNull();
    expect(n.latitude).toBeNull();
    expect(n.time).toBeNull();
    expect(n.category).toBe('drought');
  });

  it('maps EONET category ids to normalized categories', () => {
    const map: EonetEvent = {
      ...multiGeomEvent,
      id: 'e2',
      categories: [{ id: 'volcanoes', title: 'Volcanoes', link: 'x' }],
      geometry: [{ type: 'Point', date: '2026-10-19T00:00:00Z', coordinates: [10, 20] }],
    };
    expect(normalizeEonet(map).category).toBe('volcano');
  });
});
