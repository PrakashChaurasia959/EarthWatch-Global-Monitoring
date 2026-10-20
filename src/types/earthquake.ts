/** Raw USGS GeoJSON feed shapes (subset we rely on). */

export interface UsgsFeatureProperties {
  mag: number | null;
  place: string | null;
  /** Epoch milliseconds. */
  time: number;
  updated: number;
  tz: number | null;
  url: string;
  detail: string;
  felt: number | null;
  cdi: number | null;
  mmi: number | null;
  alert: string | null;
  status: string;
  tsunami: 0 | 1;
  sig: number | null;
  net: string;
  code: string;
  ids: string;
  types: string;
  nst: number | null;
  dmin: number | null;
  rms: number | null;
  gap: number | null;
  magType: string;
  type: string;
  title: string;
  /** Comma-separated source network codes, e.g. ",nn," */
  sources: string;
}

export interface UsgsFeature {
  type: 'Feature';
  properties: UsgsFeatureProperties;
  geometry: { type: 'Point'; coordinates: [number, number, number] } | null;
  id: string;
}

export interface UsgsMetadata {
  generated: number;
  url: string;
  title: string;
  status: number;
  api: string;
  count: number;
}

export interface UsgsFeed {
  type: 'FeatureCollection';
  metadata: UsgsMetadata;
  features: UsgsFeature[];
}

/** Supported USGS summary feed windows. */
export type QuakeWindow = 'hour' | 'day' | 'week' | 'month';

/** Magnitude bands used by the legend and the distribution chart. */
export interface MagBand {
  label: string;
  min: number;
  max: number;
  color: string;
}
