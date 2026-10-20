/**
 * NASA FIRMS active fire detections. The CSV endpoint returns a header row
 * followed by data rows; we parse the documented column order.
 *
 * FIRMS CSV columns (canonical order):
 * latitude,longitude,bright_ti4,scan,track,acq_date,acq_time,satellite,
 * confidence,vers, bright_ti5,frp,daynight
 */
export interface FirmsDetection {
  id: string;
  latitude: number;
  longitude: number;
  brightTi4: number | null;
  scan: number | null;
  track: number | null;
  /** ISO date string YYYY-MM-DD */
  acqDate: string;
  /** HH:MM UTC */
  acqTime: string;
  satellite: string;
  confidence: number | null;
  brightTi5: number | null;
  /** Fire Radiative Power (MW) */
  frp: number | null;
  daynight: 'D' | 'N';
  /** Epoch ms of acquisition. */
  time: number;
}

export type FirmsSource = 'VIIRS_SNPP' | 'VIIRS_NOAA20' | 'MODIS' | 'combined';
