/**
 * Shared, source-agnostic event model. All upstream API responses are
 * normalized into this shape so the map, list, charts, and analytics can
 * treat earthquakes, EONET events, and fire detections uniformly.
 */

export type EventSource = 'usgs' | 'eonet' | 'firms';

/** Stable category identifiers used across the UI (filters, markers, charts). */
export type EventCategory =
  | 'earthquake'
  | 'wildfire'
  | 'severeStorms'
  | 'volcano'
  | 'flood'
  | 'landslide'
  | 'drought'
  | 'dustHaze'
  | 'manmade'
  | 'seaLakeIce'
  | 'snow'
  | 'tempExtremes'
  | 'waterColor'
  | 'other';

export interface NormalizedEvent {
  id: string;
  source: EventSource;
  category: EventCategory;
  title: string;
  description?: string;
  /** Epoch milliseconds, or null when unknown. */
  time: number | null;
  /** Primary coordinates. null when the event has no usable point geometry. */
  longitude: number | null;
  latitude: number | null;
  /** Earthquake magnitude, fire brightness, or EONET magnitude value. */
  magnitude: number | null;
  magnitudeUnit?: string | null;
  /** Earthquake depth in km, when available. */
  depth?: number | null;
  /** Confidence 0-100 for FIRMS detections. */
  confidence?: number | null;
  /** Upstream event page or source URL. */
  url?: string;
  /** Upstream source identifiers, e.g. ["USGS","NEIC"] or ["JTWC"]. */
  sourceIds?: string[];
  /** Any extra source-specific fields we want to surface in detail panels. */
  extra?: Record<string, string | number | null | undefined>;
  /** Whether this event is considered "closed" by the upstream provider. */
  closed?: boolean | null;
}

/** Result envelope returned by all data hooks. */
export interface DataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  /** Epoch ms of the last *successful* fetch. */
  lastUpdated: number | null;
  /** True when we are serving cached data during a failed refresh. */
  stale: boolean;
  /** Connection status used by the monitoring panel. */
  status: 'ok' | 'error' | 'idle' | 'loading';
}

/** A point ready to plot on the map. */
export interface MapPoint {
  id: string;
  source: EventSource;
  category: EventCategory;
  longitude: number;
  latitude: number;
  title: string;
  magnitude: number | null;
}
