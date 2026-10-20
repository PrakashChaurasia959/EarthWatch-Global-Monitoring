/** NASA APOD (Astronomy Picture of the Day) — clearly astronomy, not Earth. */
export interface ApodItem {
  title: string;
  date: string;
  explanation: string;
  mediaType: 'image' | 'video';
  url: string;
  hdurl?: string | null;
  copyright?: string | null;
  serviceVersion?: string;
}

/** A GIBS imagery layer we surface in the satellite explorer. */
export interface GibsLayer {
  id: string;
  title: string;
  subtitle: string;
  /** WMTS TileMatrixSet name compatible with EPSG:3857 web mercator. */
  matrixSet: string;
  /** Maximum native zoom supported by this matrix set (Leaflet maxNativeZoom). */
  maxLevel: number;
  /** Whether this layer is time-enabled and supports date selection. */
  temporal: boolean;
  format: 'png' | 'jpeg';
  /** Suggested default YYYY-MM-DD date string when temporal. */
  defaultDate?: string;
}
