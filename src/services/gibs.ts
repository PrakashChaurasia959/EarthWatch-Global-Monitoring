import type { GibsLayer } from '@/types/nasa';
import { toIsoDate } from '@/utils/date';

/**
 * NASA GIBS (Global Imagery Browse Services) — fully public, no API key.
 * We use the EPSG:3857 WMTS RESTful tile endpoint, which is directly
 * compatible with Leaflet's standard XYZ TileLayer (Google tiling scheme).
 *
 * TileMatrixSet names and formats below were verified against the live
 * GetCapabilities document (the matrix sets are versioned, e.g.
 * `GoogleMapsCompatible_Level9`, and some layers such as the thermal
 * anomalies are vector tiles — excluded here so every layer renders as
 * raster imagery).
 *
 * Docs: https://nasa-gibs.github.io/gibs-api-docs/
 */

const GIBS_WMTS = 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best';

const yesterday = toIsoDate(Date.now() - 86_400_000);

/** Curated set of GIBS layers surfaced in the Satellite Explorer (all raster). */
export const GIBS_LAYERS: GibsLayer[] = [
  {
    id: 'MODIS_Terra_CorrectedReflectance_TrueColor',
    title: 'MODIS Terra True Color',
    subtitle: 'Daily natural-color imagery from MODIS aboard Terra (~250m–1km)',
    matrixSet: 'GoogleMapsCompatible_Level9',
    maxLevel: 9,
    temporal: true,
    format: 'jpeg',
    defaultDate: yesterday,
  },
  {
    id: 'MODIS_Aqua_CorrectedReflectance_TrueColor',
    title: 'MODIS Aqua True Color',
    subtitle: 'Daily natural-color imagery from MODIS aboard Aqua (~250m–1km)',
    matrixSet: 'GoogleMapsCompatible_Level9',
    maxLevel: 9,
    temporal: true,
    format: 'jpeg',
    defaultDate: yesterday,
  },
  {
    id: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
    title: 'VIIRS SNPP True Color',
    subtitle: 'Daily true-color imagery from VIIRS aboard Suomi-NPP (~375m)',
    matrixSet: 'GoogleMapsCompatible_Level9',
    maxLevel: 9,
    temporal: true,
    format: 'jpeg',
    defaultDate: yesterday,
  },
  {
    id: 'MODIS_Terra_CorrectedReflectance_Bands721',
    title: 'MODIS Terra False Color (Bands 7-2-1)',
    subtitle: 'False-color view highlighting vegetation, burn scars, and snow',
    matrixSet: 'GoogleMapsCompatible_Level9',
    maxLevel: 9,
    temporal: true,
    format: 'jpeg',
    defaultDate: yesterday,
  },
  {
    id: 'VIIRS_SNPP_DayNightBand_At_Sensor_Radiance',
    title: 'VIIRS Night Lights (Day/Night Band)',
    subtitle: 'Nighttime lights and moonlit/cloud imagery from Suomi-NPP',
    matrixSet: 'GoogleMapsCompatible_Level8',
    maxLevel: 8,
    temporal: true,
    format: 'png',
    defaultDate: yesterday,
  },
  {
    id: 'MODIS_Terra_NDSI_Snow_Cover',
    title: 'MODIS Terra Snow Cover (NDSI)',
    subtitle: 'Normalized Difference Snow Index — snow extent from MODIS Terra',
    matrixSet: 'GoogleMapsCompatible_Level8',
    maxLevel: 8,
    temporal: true,
    format: 'png',
    defaultDate: yesterday,
  },
  {
    id: 'MODIS_Terra_Aerosol',
    title: 'MODIS Terra Aerosol Optical Depth',
    subtitle: 'Smoke, dust, and haze aerosol optical depth from MODIS Terra',
    matrixSet: 'GoogleMapsCompatible_Level6',
    maxLevel: 6,
    temporal: true,
    format: 'png',
    defaultDate: yesterday,
  },
  {
    id: 'VIIRS_SNPP_Brightness_Temp_BandI5_Day',
    title: 'VIIRS Brightness Temperature (Band I5, Day)',
    subtitle: 'Thermal brightness temperature — useful for spotting heat sources',
    matrixSet: 'GoogleMapsCompatible_Level9',
    maxLevel: 9,
    temporal: true,
    format: 'png',
    defaultDate: yesterday,
  },
];

/**
 * Build a Leaflet-compatible tile URL template for a GIBS layer.
 * Leaflet substitutes {z}/{x}/{y}. The {date} placeholder is replaced at
 * call time (we control it via the GibsOverlay component).
 */
export function gibsTileTemplate(layer: GibsLayer, date: string): string {
  const ext = layer.format;
  return `${GIBS_WMTS}/${encodeURIComponent(layer.id)}/default/${date}/${layer.matrixSet}/{z}/{y}/{x}.${ext}`;
}

/** Attribution string for GIBS imagery. */
export const GIBS_ATTRIBUTION = 'Imagery © NASA GIBS';

/** Earliest date most curated layers are available from. */
export const GIBS_EARLIEST = '2012-05-08';
