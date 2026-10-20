/** Number / text formatting helpers (pure, testable). */

/** Format a magnitude/number with fixed precision, falling back to '—'. */
export function fmtNum(value: number | null | undefined, digits = 1): string {
  if (value == null || Number.isNaN(value)) return '—';
  return value.toFixed(digits);
}

/** Compact integer with thousands separators. */
export function fmtInt(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat('en-US').format(Math.round(value));
}

/** Truncate long text, adding an ellipsis. */
export function truncate(text: string, max = 80): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + '…';
}

/** Clamp a number into [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** USGS-style magnitude bands with colors used across the legend, markers, charts. */
export interface MagBand {
  label: string;
  min: number;
  max: number;
  color: string;
  glow: string;
}

export const MAGNITUDE_BANDS: MagBand[] = [
  { label: 'M < 2.5', min: -Infinity, max: 2.5, color: '#64748b', glow: 'rgba(100,116,139,0.5)' },
  { label: 'M 2.5–4.5', min: 2.5, max: 4.5, color: '#22d3ee', glow: 'rgba(34,211,238,0.6)' },
  { label: 'M 4.5–5.5', min: 4.5, max: 5.5, color: '#34d399', glow: 'rgba(52,211,153,0.6)' },
  { label: 'M 5.5–6.5', min: 5.5, max: 6.5, color: '#f59e0b', glow: 'rgba(245,158,11,0.6)' },
  { label: 'M ≥ 6.5', min: 6.5, max: Infinity, color: '#fb7185', glow: 'rgba(251,113,133,0.7)' },
];

/** Return the band a magnitude belongs to. */
export function bandForMagnitude(mag: number | null): MagBand {
  if (mag == null) return MAGNITUDE_BANDS[0];
  return MAGNITUDE_BANDS.find((b) => mag >= b.min && mag < b.max) ?? MAGNITUDE_BANDS[0];
}

/** Marker radius (px) for a magnitude, scaled for visual clarity. */
export function magnitudeRadius(mag: number | null): number {
  if (mag == null) return 6;
  return clamp(4 + Math.max(0, mag) * 1.6, 4, 18);
}
