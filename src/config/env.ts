/**
 * Centralized, validated environment configuration.
 * Only VITE_-prefixed variables reach the browser bundle. We never read
 * anything that could be a secret here. All values have safe fallbacks so
 * the app keeps working when keys are missing.
 */

function readString(name: string, fallback = ''): string {
  const v = import.meta.env[name];
  return typeof v === 'string' && v.trim().length > 0 ? v.trim() : fallback;
}

export const NASA_API_KEY = readString('VITE_NASA_API_KEY', 'DEMO_KEY');
export const FIRMS_MAP_KEY = readString('VITE_FIRMS_MAP_KEY', '');

export const DEFAULT_QUAKE_WINDOW = readString(
  'VITE_DEFAULT_QUAKE_WINDOW',
  'day',
) as 'hour' | 'day' | 'week' | 'month';

export const DEFAULT_FIRMS_SOURCE = readString(
  'VITE_DEFAULT_FIRMS_SOURCE',
  'VIIRS_SNPP',
) as 'VIIRS_SNPP' | 'VIIRS_NOAA20' | 'MODIS' | 'combined';

/** Is the FIRMS fire API usable in this build? */
export const FIRMS_CONFIGURED = FIRMS_MAP_KEY.length > 0;

/** Is the app using the shared DEMO_KEY (rate-limited) rather than a real key? */
export const USING_DEMO_KEY = NASA_API_KEY === 'DEMO_KEY';

/** Human-friendly summary of configuration for the monitoring-status UI. */
export const ENV_SUMMARY = {
  nasaKey: NASA_API_KEY ? (USING_DEMO_KEY ? 'DEMO_KEY (rate-limited)' : 'configured') : 'missing',
  firmsKey: FIRMS_CONFIGURED ? 'configured' : 'not configured',
};
