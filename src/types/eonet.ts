/** Raw NASA EONET v3 event shapes (subset we rely on). */

export interface EonetCategory {
  id: string;
  title: string;
  link: string;
}

export interface EonetSource {
  id: string;
  url: string;
}

export interface EonetGeometry {
  type: 'Point' | 'Polygon' | 'LineString';
  date?: string;
  /** Point: [lon, lat]; LineString: [[lon,lat], ...]; Polygon: [[[lon,lat],...]] */
  coordinates: number[] | number[][] | number[][][];
  magnitudeValue?: number | null;
  magnitudeUnit?: string | null;
}

export interface EonetEvent {
  id: string;
  title: string;
  description?: string | null;
  link: string;
  categories: EonetCategory[];
  sources: EonetSource[];
  geometry: EonetGeometry[];
  closed?: string | null;
}

export interface EonetEventsResponse {
  events: EonetEvent[];
}

export interface EonetCategoryInfo {
  id: string;
  title: string;
  link: string;
  description?: string;
}

export interface EonetCategoryListResponse {
  categories: EonetCategoryInfo[];
}

export interface EonetLayerInfo {
  id: string;
  title: string;
  type: string;
  subtitle?: string;
  source?: string;
  parameters?: EonetLayerParameter[];
}

export interface EonetLayerParameter {
  id: string;
  title: string;
  type: string;
  units: string;
  possibleValues?: { category: string; value: string }[];
}

export interface EonetLayersResponse {
  layers: EonetLayerInfo[];
}
