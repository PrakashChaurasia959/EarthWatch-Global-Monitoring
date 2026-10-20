import type { EonetGeometry } from '@/types/eonet';

/**
 * Extract a single representative [longitude, latitude] point from an
 * EONET geometry, which may be a Point, Polygon, or LineString. Returns null
 * when coordinates are missing or malformed.
 */
export function pointFromGeometry(geometry: EonetGeometry | undefined): [number, number] | null {
  if (!geometry || !geometry.coordinates) return null;

  if (geometry.type === 'Point') {
    const c = geometry.coordinates as number[];
    const [lon, lat] = c;
    if (validLonLat(lon, lat)) return [lon, lat];
    return null;
  }

  if (geometry.type === 'LineString') {
    const coords = geometry.coordinates as number[][];
    const first = coords[0];
    if (first && validLonLat(first[0], first[1])) return [first[0] as number, first[1] as number];
    return null;
  }

  if (geometry.type === 'Polygon') {
    const rings = geometry.coordinates as number[][][];
    const ring = rings[0];
    const first = ring?.[0];
    if (first && validLonLat(first[0], first[1])) return [first[0] as number, first[1] as number];
    return null;
  }

  return null;
}

/** Pick the most recent geometry that carries a usable point. */
export function latestPointFromGeometries(
  geometries: EonetGeometry[] | undefined,
): { point: [number, number] | null; date: string | null } {
  if (!geometries || geometries.length === 0) return { point: null, date: null };
  // EONET typically returns newest-first; fall back to scanning all.
  for (const g of geometries) {
    const point = pointFromGeometry(g);
    if (point) return { point, date: g.date ?? null };
  }
  return { point: null, date: geometries[0].date ?? null };
}

export function validLonLat(lon: unknown, lat: unknown): lon is number {
  return (
    typeof lon === 'number' &&
    typeof lat === 'number' &&
    Number.isFinite(lon) &&
    Number.isFinite(lat) &&
    lon >= -180 &&
    lon <= 180 &&
    lat >= -90 &&
    lat <= 90
  );
}

/** Great-circle distance in km between two lon/lat points (haversine). */
export function distanceKm(
  a: [number, number],
  b: [number, number],
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[1] - a[1]);
  const dLon = toRad(b[0] - a[0]);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[1])) * Math.cos(toRad(b[1])) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

/** Normalize a longitude into [-180, 180] for display. */
export function normalizeLon(lon: number): number {
  return ((((lon + 180) % 360) + 360) % 360) - 180;
}
