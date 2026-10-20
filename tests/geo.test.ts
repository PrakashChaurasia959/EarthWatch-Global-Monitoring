import { describe, it, expect } from 'vitest';
import {
  pointFromGeometry,
  latestPointFromGeometries,
  validLonLat,
  distanceKm,
  normalizeLon,
} from '@/utils/geo';
import type { EonetGeometry } from '@/types/eonet';

describe('geo utils', () => {
  it('extracts a point from Point geometry', () => {
    const g: EonetGeometry = { type: 'Point', date: '2026-10-19T00:00:00Z', coordinates: [-118.02, 37.42] };
    expect(pointFromGeometry(g)).toEqual([-118.02, 37.42]);
  });

  it('extracts the first point from a LineString', () => {
    const g: EonetGeometry = {
      type: 'LineString',
      date: '2026-10-19T00:00:00Z',
      coordinates: [[-10, 5], [-9, 6], [-8, 7]],
    };
    expect(pointFromGeometry(g)).toEqual([-10, 5]);
  });

  it('extracts the first point from a Polygon ring', () => {
    const g: EonetGeometry = {
      type: 'Polygon',
      date: '2026-10-19T00:00:00Z',
      coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]],
    };
    expect(pointFromGeometry(g)).toEqual([0, 0]);
  });

  it('returns null for malformed coordinates', () => {
    expect(pointFromGeometry({ type: 'Point', coordinates: [200, 37] } as EonetGeometry)).toBeNull();
    expect(pointFromGeometry(undefined)).toBeNull();
    expect(pointFromGeometry({ type: 'Point', coordinates: [] as unknown as number[] } as EonetGeometry)).toBeNull();
  });

  it('picks the newest geometry with a usable point', () => {
    const geoms: EonetGeometry[] = [
      { type: 'Point', date: '2026-10-18T00:00:00Z', coordinates: [-163.3, -10.8] },
      { type: 'Point', date: '2026-10-19T00:00:00Z', coordinates: [-160, -11] },
    ];
    const { point, date } = latestPointFromGeometries(geoms);
    expect(point).toEqual([-163.3, -10.8]);
    expect(date).toBe('2026-10-18T00:00:00Z');
  });

  it('returns null point when no geometry has coords', () => {
    const { point } = latestPointFromGeometries([
      { type: 'Point', coordinates: [200, 91] } as EonetGeometry,
    ]);
    expect(point).toBeNull();
  });

  it('validates lon/lat ranges', () => {
    expect(validLonLat(0, 0)).toBe(true);
    expect(validLonLat(-180, -90)).toBe(true);
    expect(validLonLat(180, 90)).toBe(true);
    expect(validLonLat(181, 0)).toBe(false);
    expect(validLonLat(0, 91)).toBe(false);
    expect(validLonLat(NaN, 0)).toBe(false);
  });

  it('computes haversine distance (approximately)', () => {
    // Paris to Berlin ~ 878 km
    const d = distanceKm([2.3522, 48.8566], [13.405, 52.52]);
    expect(d).toBeGreaterThan(860);
    expect(d).toBeLessThan(900);
  });

  it('normalizes longitudes into [-180, 180]', () => {
    expect(normalizeLon(190)).toBe(-170);
    expect(normalizeLon(-190)).toBe(170);
    expect(normalizeLon(0)).toBe(0);
  });
});
