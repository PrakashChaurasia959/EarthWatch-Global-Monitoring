import { useMemo, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, ScaleControl, ZoomControl } from 'react-leaflet';
import { EventMarkers } from './EventMarkers';
import { GibsOverlay } from './GibsLayer';
import type { NormalizedEvent, EventCategory } from '@/types/common';
import type { GibsLayer as GibsLayerType } from '@/types/nasa';
import { ALL_CATEGORIES, CATEGORY_META } from '@/utils/categories';
import { Spinner } from '@/components/ui/Skeleton';
import { Layers, MapIcon, List, Satellite } from 'lucide-react';

const BASE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const BASE_ATTR = '&copy; OpenStreetMap contributors &copy; CARTO';

interface WorldMapProps {
  events: NormalizedEvent[];
  activeCategories: EventCategory[];
  onToggleCategory?: (cat: EventCategory) => void;
  heightClass?: string;
  center?: [number, number];
  zoom?: number;
  loading?: boolean;
  /** Optional GIBS satellite overlay config. */
  gibs?: { layer: GibsLayerType; date: string } | null;
  showGibs?: boolean;
  onToggleGibs?: () => void;
  onSelectEvent?: (event: NormalizedEvent) => void;
  limit?: number;
}

/** Tracks mouse coordinates and reports them via callback for the readout. */
function MouseTracker({ onMove }: { onMove: (lat: number, lng: number) => void }) {
  useMapEvents({
    mousemove(e) {
      onMove(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function WorldMap({
  events,
  activeCategories,
  onToggleCategory,
  heightClass = 'h-[520px]',
  center = [20, 0],
  zoom = 2,
  loading = false,
  gibs = null,
  showGibs = false,
  onToggleGibs,
  onSelectEvent,
  limit,
}: WorldMapProps) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const filtered = useMemo(
    () => events.filter((e) => activeCategories.includes(e.category)),
    [events, activeCategories],
  );

  const counts = useMemo(() => {
    const map = new Map<EventCategory, number>();
    for (const e of filtered) map.set(e.category, (map.get(e.category) ?? 0) + 1);
    return map;
  }, [filtered]);

  return (
    <div className={`relative w-full ${heightClass} rounded-2xl overflow-hidden border border-white/5 bg-space-900`}>
      <MapContainer
        center={center}
        zoom={zoom}
        minZoom={1}
        maxZoom={12}
        zoomControl={false}
        worldCopyJump
        className="w-full h-full"
        scrollWheelZoom
        attributionControl
      >
        <ScaleControl position="bottomleft" imperial={false} />
        <ZoomControl position="bottomright" />
        <TileLayer url={BASE_URL} attribution={BASE_ATTR} subdomains="abcd" maxZoom={19} detectRetina />
        {showGibs && gibs && <GibsOverlay layer={gibs.layer} date={gibs.date} opacity={0.9} />}
        <MouseTracker onMove={(lat, lng) => setCoords({ lat, lng })} />
        <EventMarkers events={filtered} onSelect={onSelectEvent} limit={limit} />
      </MapContainer>

      {/* Loading veil */}
      {loading && (
        <div className="absolute top-3 right-3 glass rounded-xl px-3 py-2 flex items-center gap-2 text-xs text-slate-300">
          <Spinner size={14} /> Loading events…
        </div>
      )}

      {/* Layer controls */}
      {onToggleCategory && (
        <div className="absolute top-3 left-3 glass rounded-xl p-2.5 w-44 max-h-[70%] overflow-y-auto">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase mb-2">
            <Layers size={12} /> Layers
          </p>
          <ul className="space-y-1">
            {ALL_CATEGORIES.map((cat) => {
              const meta = CATEGORY_META[cat];
              const on = activeCategories.includes(cat);
              const count = counts.get(cat) ?? 0;
              return (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => onToggleCategory(cat)}
                    aria-pressed={on}
                    className={`w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors ${
                      on ? 'bg-white/5 text-slate-200' : 'text-slate-500 hover:bg-white/5'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{
                        backgroundColor: on ? meta.color : 'transparent',
                        border: `1.5px solid ${meta.color}`,
                      }}
                    />
                    <span className="flex-1 text-left truncate">{meta.label}</span>
                    <span className="text-[10px] text-slate-600">{count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          {gibs && onToggleGibs && (
            <div className="mt-2 pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={onToggleGibs}
                aria-pressed={showGibs}
                className={`w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors ${
                  showGibs ? 'bg-accent-cyan/10 text-accent-cyan' : 'text-slate-500 hover:bg-white/5'
                }`}
              >
                <Satellite size={14} /> Satellite imagery
              </button>
            </div>
          )}
        </div>
      )}

      {/* Coordinate readout */}
      <div className="absolute bottom-3 left-3 glass rounded-lg px-2.5 py-1.5 font-mono text-[11px] text-slate-400 pointer-events-none">
        {coords
          ? `${coords.lat.toFixed(3)}°, ${coords.lng.toFixed(3)}°`
          : 'Move cursor for coordinates'}
      </div>

      {/* Accessible contents summary (screen-reader friendly) */}
      <div className="sr-only" role="region" aria-label="Map contents">
        <p>Interactive world map showing {filtered.length} events.</p>
        <ul>
          {ALL_CATEGORIES.filter((c) => counts.get(c)).map((c) => (
            <li key={c}>
              {CATEGORY_META[c].label}: {counts.get(c)} events
            </li>
          ))}
        </ul>
        <p>A sortable, searchable table of these events is available on the page below the map.</p>
      </div>

      {/* Decorative base layer label */}
      <div className="absolute bottom-3 right-3 glass rounded-lg px-2 py-1 text-[10px] text-slate-500 pointer-events-none flex items-center gap-1">
        <MapIcon size={11} /> Dark basemap
        <span className="mx-1">·</span>
        <List size={11} /> {filtered.length} shown
      </div>
    </div>
  );
}
