import { describe, it, expect } from 'vitest';
import { isUsgsFeed, normalizeUsgs } from '@/services/usgs';
import type { UsgsFeed, UsgsFeature } from '@/types/earthquake';

const sampleFeature: UsgsFeature = {
  type: 'Feature',
  id: 'nn00925999',
  properties: {
    mag: 4.2,
    place: '26 km S of Dyer, Nevada',
    time: 1792498028266,
    updated: 1792498174318,
    tz: null,
    url: 'https://earthquake.usgs.gov/earthquakes/eventpage/nn00925999',
    detail: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/nn00925999.geojson',
    felt: null,
    cdi: null,
    mmi: null,
    alert: null,
    status: 'automatic',
    tsunami: 0,
    sig: 36,
    net: 'nn',
    code: '00925999',
    ids: ',nn00925999,',
    sources: ',nn,',
    types: ',origin,phase-data,',
    nst: 10,
    dmin: 0.074,
    rms: 0.3834,
    gap: 189,
    magType: 'ml',
    type: 'earthquake',
    title: 'M 4.2 - 26 km S of Dyer, Nevada',
  },
  geometry: { type: 'Point', coordinates: [-118.0243, 37.4295, 4.2401] },
};

const sampleFeed: UsgsFeed = {
  type: 'FeatureCollection',
  metadata: {
    generated: 1792498200000,
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson',
    title: 'USGS Earthquakes',
    status: 200,
    api: '1.0.0',
    count: 1,
  },
  features: [sampleFeature],
};

describe('USGS service', () => {
  it('validates a real feed shape', () => {
    expect(isUsgsFeed(sampleFeed)).toBe(true);
    // A feature collection with empty metadata object is still a valid shape.
    expect(isUsgsFeed({ type: 'FeatureCollection', features: [], metadata: {} })).toBe(true);
    expect(isUsgsFeed(null)).toBe(false);
    expect(isUsgsFeed({ features: [] })).toBe(false); // missing type + metadata
    expect(isUsgsFeed({ type: 'FeatureCollection', features: 'no', metadata: {} })).toBe(false); // features not an array
    expect(isUsgsFeed({ type: 'FeatureCollection', features: [], metadata: null })).toBe(false); // metadata null
  });

  it('normalizes a USGS feature to the common model', () => {
    const n = normalizeUsgs(sampleFeature);
    expect(n.id).toBe('nn00925999');
    expect(n.source).toBe('usgs');
    expect(n.category).toBe('earthquake');
    expect(n.magnitude).toBe(4.2);
    expect(n.longitude).toBe(-118.0243);
    expect(n.latitude).toBe(37.4295);
    expect(n.depth).toBe(4.2401);
    expect(n.time).toBe(1792498028266);
    expect(n.title).toBe('M 4.2 - 26 km S of Dyer, Nevada');
    expect(n.url).toContain('eventpage/nn00925999');
    expect(n.sourceIds).toEqual(['nn']);
  });

  it('handles missing magnitude and null geometry safely', () => {
    const noGeom: UsgsFeature = {
      ...sampleFeature,
      id: 'x1',
      geometry: null,
      properties: { ...sampleFeature.properties, mag: null, place: 'Somewhere' },
    };
    const n = normalizeUsgs(noGeom);
    expect(n.magnitude).toBeNull();
    expect(n.longitude).toBeNull();
    expect(n.latitude).toBeNull();
    expect(n.depth).toBeNull();
    expect(n.description).toBe('Somewhere');
  });
});
