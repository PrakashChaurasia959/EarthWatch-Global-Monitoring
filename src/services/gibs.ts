import type { GibsLayer } from '@/types/nasa';
import { toIsoDate } from '@/utils/date';

/**
 * NASA GIBS — Global Imagery Browse Services.
 *
 * Public satellite imagery service. No API key required.
 * Uses the EPSG:3857 WMTS RESTful tile endpoint.
 *
 * Calendar range:
 *   Start: 2000-01-01
 *   End:   2100-12-31
 *
 * Important:
 * Calendar range does not guarantee that NASA imagery exists
 * for every date or every imagery layer.
 */

const GIBS_WMTS =
  'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best';

/**
 * Application calendar boundaries.
 */
export const GIBS_EARLIEST = '2000-01-01';

export const GIBS_CALENDAR_LAST_YEAR = 2100;

export const GIBS_CALENDAR_LAST_DATE = '2100-12-31';

/**
 * Return today's date in ISO format.
 *
 * Uses the same date utility as the rest of the application.
 * The optional timestamp is useful for testing.
 */
export function gibsToday(
  now: number = Date.now(),
): string {
  return toIsoDate(now);
}

/**
 * Return the latest date allowed for NASA imagery requests.
 *
 * Future imagery dates are not requested because future
 * satellite observations are not available yet.
 */
export function gibsMaxSelectableDate(
  now: number = Date.now(),
): string {
  return gibsToday(now);
}

/**
 * Return all years displayed by the date picker.
 *
 * This list is independent of the imagery availability.
 */
export function gibsCalendarYears(): number[] {
  const firstYear = Number(
    GIBS_EARLIEST.slice(0, 4),
  );

  return Array.from(
    {
      length:
        GIBS_CALENDAR_LAST_YEAR - firstYear + 1,
    },
    (_, index) => firstYear + index,
  );
}

/**
 * Strictly validate an ISO date.
 *
 * Accepted format: YYYY-MM-DD
 *
 * Rejects invalid dates such as:
 * 2026-02-31
 * 2026-13-01
 * abc
 */
function isValidIsoDate(
  date: string,
): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parsed = new Date(
    `${date}T00:00:00.000Z`,
  );

  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === date
  );
}

/**
 * Check whether a date falls within the application's
 * calendar range: 2000-01-01 through 2100-12-31.
 *
 * Future dates can belong to the calendar range,
 * even though they cannot be used for imagery requests.
 */
export function isGibsDateInCalendarRange(
  date: string,
): boolean {
  return (
    isValidIsoDate(date) &&
    date >= GIBS_EARLIEST &&
    date <= GIBS_CALENDAR_LAST_DATE
  );
}

/**
 * Check whether a date is valid for an actual imagery request.
 *
 * The date must:
 * - Be a valid ISO date.
 * - Be inside the application's calendar range.
 * - Not be later than today.
 *
 * The optional timestamp supports deterministic tests.
 */
export function isGibsDateSelectable(
  date: string,
  now: number = Date.now(),
): boolean {
  return (
    isGibsDateInCalendarRange(date) &&
    date <= gibsMaxSelectableDate(now)
  );
}

/**
 * Return yesterday's date.
 *
 * NASA imagery may have processing delays, so yesterday
 * is used as the initial imagery date.
 */
function getYesterday(): string {
  return toIsoDate(
    Date.now() - 24 * 60 * 60 * 1000,
  );
}

/**
 * NASA GIBS imagery layers supported by Satellite Explorer.
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
      'False-color imagery highlighting vegetation, burn scars, and snow',
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
 * Leaflet replaces {z}, {y}, and {x} with tile coordinates.
 *
 * Invalid or future dates are rejected instead of silently
 * displaying imagery for a different date.
 */
export function gibsTileTemplate(
  layer: GibsLayer,
  date: string,
): string {
  if (!isGibsDateSelectable(date)) {
    throw new RangeError(
      `Invalid imagery date "${date}". Choose a date from ` +
        `${GIBS_EARLIEST} through ${gibsMaxSelectableDate()}.`,
    );
  }

  return (
    `${GIBS_WMTS}/` +
    `${encodeURIComponent(layer.id)}/default/` +
    `${date}/` +
    `${layer.matrixSet}/{z}/{y}/{x}.${layer.format}`
  );
}

/**
 * Attribution required for NASA GIBS imagery.
 */
export const GIBS_ATTRIBUTION =
  'Imagery © NASA GIBS';
