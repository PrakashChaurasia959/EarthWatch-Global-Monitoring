import L from 'leaflet';
import type { EventCategory } from '@/types/common';
import { CATEGORY_META } from '@/utils/categories';
import { magnitudeRadius, bandForMagnitude } from '@/utils/format';

/**
 * Build a Leaflet divIcon (no external image assets — avoids the default
 * marker-image path issues entirely). Color and size encode category +
 * magnitude. The outer ring is a soft glow; the inner dot is the marker.
 */
export function buildEventIcon(category: EventCategory, magnitude: number | null, active = false): L.DivIcon {
  const meta = CATEGORY_META[category] ?? CATEGORY_META.other;
  const band = category === 'earthquake' ? bandForMagnitude(magnitude) : null;
  const color = band ? band.color : meta.color;
  const glow = band ? band.glow : meta.glow;
  const radius = category === 'earthquake' ? magnitudeRadius(magnitude) : 7;

  // Earthquake markers scale with magnitude; others use a fixed size.
  const pulse = active ? 'animate-pulse-soft' : '';
  const ring = active
    ? `<span class="absolute inset-0 rounded-full" style="box-shadow:0 0 0 4px ${glow};"></span>`
    : '';

  const html = `
    <div class="ew-marker ${pulse}" style="--c:${color};--g:${glow};width:${radius * 2}px;height:${radius * 2}px;">
      <span class="ew-marker__halo"></span>
      <span class="ew-marker__core"></span>
      ${ring}
    </div>`;

  return L.divIcon({
    html,
    className: 'ew-marker-wrapper',
    iconSize: [radius * 2, radius * 2],
    iconAnchor: [radius, radius],
    popupAnchor: [0, -radius],
  });
}
