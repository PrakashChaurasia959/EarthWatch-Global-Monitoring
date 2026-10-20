import { TileLayer } from 'react-leaflet';
import { useMemo } from 'react';
import type { GibsLayer as GibsLayerType } from '@/types/nasa';
import { gibsTileTemplate, GIBS_ATTRIBUTION } from '@/services/gibs';

/**
 * A NASA GIBS imagery overlay. The tile URL has the date baked in; when the
 * date changes we remount via `key` so Leaflet reloads tiles for that day.
 */
export function GibsOverlay({
  layer,
  date,
  opacity = 0.85,
}: {
  layer: GibsLayerType;
  date: string;
  opacity?: number;
}) {
  const url = useMemo(() => gibsTileTemplate(layer, date), [layer, date]);
  return (
    <TileLayer
      key={`${layer.id}-${date}`}
      url={url}
      opacity={opacity}
      attribution={GIBS_ATTRIBUTION}
      detectRetina={false}
      // GIBS matrix sets cap at `layer.maxLevel`; beyond that Leaflet upscales
      // the max-level tiles instead of requesting (and 400ing on) deeper ones.
      maxNativeZoom={layer.maxLevel}
      maxZoom={12}
      tileSize={256}
    />
  );
}
