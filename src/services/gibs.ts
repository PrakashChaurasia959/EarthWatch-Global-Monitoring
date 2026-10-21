import type { GibsLayer } from '@/types/nasa';
import { toIsoDate } from '@/utils/date';

/**
 * NASA GIBS (Global Imagery Browse Services)
 *
 * Public satellite imagery service. No API key required.
 * Uses the EPSG:3857 WMTS RESTful tile endpoint.
 *
 * Date handling:
 * - Earliest supported calendar date: 2012-01-01.
 * - Maximum selectable date: current UTC date.
 * - No hardcoded current year.
 * - Future dates are not selectable.
 * - Actual imagery availability depends on the selected layer.
 */

const GIBS_WMTS =
  'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best';

/**
 * Generate yesterday's date dynamically.
 * Used as a sensible default for imagery processing delays.
 */
function getYesterday(): string {
  return toIsoDate(Date.now() - 24 * 60 * 60 * 1000);
}

/**
 * Earliest calendar date exposed by this application.
 *
 * IMPORTANT:
 * This is a calendar boundary, not a guarantee that every layer
 * has imagery available from this date.
 */
export const GIBS_EARLIEST = '2012-01-01';

/**
 * Return the current UTC date.
 *
 * The value is calculated dynamically rather than hardcoded to a year,
 * so the application continues working in future years.
 *
 * The optional timestamp makes this function deterministic in tests.
 */
export function gibsMaxSelectableDate(
  now: number = Date.now(),
): string {
  return toIsoDate(now);
}

/**
 * Check whether a date is inside the application's supported
 * calendar range and is not in the future.
 */
export function isGibsDateSelectable(
  date: string,
  now: number = Date.now(),
): boolean {
  if (!isValidIsoDate(date)) {
    return false;
  }

  return (
    date >= GIBS_EARLIEST &&
    date <= gibsMaxSelectableDate(now)
  );
}

/**
 * Strictly validate YYYY-MM-DD dates.
 * Prevents invalid dates such as 2026-02-31.
 */
function isValidIsoDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parsed = new Date(`${date}T00:00:00.000Z`);

  if (Number.isNaN(parsed.getTime())) {
    return false;
  }

  return parsed.toISOString().slice(0, 10) === date;
}

/**
 * Curated raster imagery layers supported by the Satellite Explorer.
 */
export const GIBS_LAYERS: GibsLayer[] = [
  {
    id: 'MODIS_Terra_CorrectedReflectance_TrueColor',
    title: 'MODIS Terra True Color',
    subtitle:
      'Daily natural-color imagery from MODIS aboard Terra (~250m–1km)',
    matrixSet: 'GoogleMapsCompatible_Level9',
    maxLevel: 9,
    temporal: true,
    format: 'jpeg',
    defaultDate: getYesterday(),
  },
  {
    id: 'MODIS_Aqua_CorrectedReflectance_TrueColor',
    title: 'MODIS Aqua True Color',
    subtitle:
      'Daily natural-color imagery from MODIS aboard Aqua (~250m–1km)',
    matrixSet: 'GoogleMapsCompatible_Level9',
    maxLevel: 9,
    temporal: true,
    format: 'jpeg',
    defaultDate: getYesterday(),
  },
  {
    id: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
    title: 'VIIRS SNPP True Color',
    subtitle:
      'Daily true-color imagery from VIIRS aboard Suomi-NPP (~375m)',
    matrixSet: 'GoogleMapsCompatible_Level9',
    maxLevel: 9,
    temporal: true,
    format: 'jpeg',
    defaultDate: getYesterday(),
  },
  {
    id: 'MODIS_Terra_CorrectedReflectance_Bands721',
    title: 'MODIS Terra False Color (Bands 7-2-1)',
    subtitle:
      'False-color view highlighting vegetation, burn scars, and snow',
    matrixSet: 'GoogleMapsCompatible_Level9',
    maxLevel: 9,
    temporal: true,
    format: 'jpeg',
    defaultDate: getYesterday(),
  },
  {
    id: 'VIIRS_SNPP_DayNightBand_At_Sensor_Radiance',
    title: 'VIIRS Night Lights (Day/Night Band)',
    subtitle:
      'Nighttime lights and moonlit/cloud imagery from Suomi-NPP',
    matrixSet: 'GoogleMapsCompatible_Level8',
    maxLevel: 8,
    temporal: true,
    format: 'png',
    defaultDate: getYesterday(),
  },
  {
    id: 'MODIS_Terra_NDSI_Snow_Cover',
    title: 'MODIS Terra Snow Cover (NDSI)',
    subtitle:
      'Normalized Difference Snow Index — snow extent from MODIS Terra',
    matrixSet: 'GoogleMapsCompatible_Level8',
    maxLevel: 8,
    temporal: true,
    format: 'png',
    defaultDate: getYesterday(),
  },
  {
    id: 'MODIS_Terra_Aerosol',
    title: 'MODIS Terra Aerosol Optical Depth',
    subtitle:
      'Smoke, dust, and haze aerosol optical depth',
    matrixSet: 'GoogleMapsCompatible_Level6',
    maxLevel: 6,
    temporal: true,
    format: 'png',
    defaultDate: getYesterday(),
  },
  {
    id: 'VIIRS_SNPP_Brightness_Temp_BandI5_Day',
    title: 'VIIRS Brightness Temperature (Band I5, Day)',
    subtitle:
      'Thermal brightness temperature — useful for spotting heat sources',
    matrixSet: 'GoogleMapsCompatible_Level9',
    maxLevel: 9,
    temporal: true,
    format: 'png',
    defaultDate: getYesterday(),
  },
];

/**
 * Build a Leaflet-compatible NASA GIBS tile URL.
 *
 * The selected date is supplied by the component.
 * Leaflet substitutes z, x, and y for each tile request.
 */
export function gibsTileTemplate(
  layer: GibsLayer,
  date: string,
): string {
  const safeDate = isGibsDateSelectable(date)
    ? date
    : gibsMaxSelectableDate();

  return (
    `${GIBS_WMTS}/` +
    `${encodeURIComponent(layer.id)}/default/` +
    `${safeDate}/` +
    `${layer.matrixSet}/{z}/{y}/{x}.${layer.format}`
  );
}

/**
 * Attribution required for NASA GIBS imagery.
 */
export const GIBS_ATTRIBUTION = 'Imagery © NASA GIBS';
