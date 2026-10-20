import { memo, useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { buildEventIcon } from './markerIcons';
import type { NormalizedEvent } from '@/types/common';
import { CategoryBadge } from '@/components/ui/Badge';
import { formatDateTime } from '@/utils/date';
import { fmtNum } from '@/utils/format';

interface EventMarkersProps {
  events: NormalizedEvent[];
  onSelect?: (event: NormalizedEvent) => void;
  /** Cap markers for performance on very large datasets. */
  limit?: number;
}

function EventPopupContent({ event }: { event: NormalizedEvent }) {
  return (
    <div className="min-w-[220px] max-w-[280px]">
      <div className="mb-2">
        <CategoryBadge category={event.category} />
      </div>
      <p className="text-sm font-semibold text-slate-100 leading-snug">{event.title}</p>
      {event.description && (
        <p className="text-xs text-slate-400 mt-1 leading-snug">{event.description}</p>
      )}
      <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
        <dt className="text-slate-500">Date</dt>
        <dd className="text-slate-300">{event.time ? formatDateTime(event.time) : '—'}</dd>
        {event.magnitude != null && (
          <>
            <dt className="text-slate-500">{event.source === 'usgs' ? 'Magnitude' : 'Value'}</dt>
            <dd className="text-slate-300">
              {fmtNum(event.magnitude, event.source === 'usgs' ? 1 : 0)} {event.magnitudeUnit ?? ''}
            </dd>
          </>
        )}
        {event.depth != null && (
          <>
            <dt className="text-slate-500">Depth</dt>
            <dd className="text-slate-300">{fmtNum(event.depth, 1)} km</dd>
          </>
        )}
        {event.confidence != null && (
          <>
            <dt className="text-slate-500">Confidence</dt>
            <dd className="text-slate-300">{event.confidence}%</dd>
          </>
        )}
        {event.longitude != null && event.latitude != null && (
          <>
            <dt className="text-slate-500">Coords</dt>
            <dd className="text-slate-300 font-mono text-[10px]">
              {event.latitude.toFixed(2)}, {event.longitude.toFixed(2)}
            </dd>
          </>
        )}
      </dl>
      {event.url && (
        <a
          href={event.url}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1 mt-3 text-[11px] text-accent-cyan hover:text-accent-cyan/80"
        >
          View source ↗
        </a>
      )}
    </div>
  );
}

export const EventMarkers = memo(function EventMarkers({
  events,
  onSelect,
  limit = 2000,
}: EventMarkersProps) {
  const points = useMemo(() => {
    const usable = events.filter(
      (e) => e.longitude != null && e.latitude != null && Number.isFinite(e.longitude) && Number.isFinite(e.latitude),
    );
    if (usable.length <= limit) return usable;
    // Keep the most significant/recent when over the cap.
    return usable
      .sort((a, b) => (b.magnitude ?? 0) - (a.magnitude ?? 0) || (b.time ?? 0) - (a.time ?? 0))
      .slice(0, limit);
  }, [events, limit]);

  const markers = useMemo(
    () =>
      points.map((e) => (
        <Marker
          key={`${e.source}-${e.id}`}
          position={[e.latitude as number, e.longitude as number]}
          icon={buildEventIcon(e.category, e.magnitude)}
          eventHandlers={{
            click: () => onSelect?.(e),
          }}
        >
          <Popup>
            <EventPopupContent event={e} />
          </Popup>
        </Marker>
      )),
    [points, onSelect],
  );

  return (
    <MarkerClusterGroup
      chunkedLoading
      showCoverageOnHover={false}
      maxClusterRadius={52}
      spiderfyOnMaxZoom
    >
      {markers}
    </MarkerClusterGroup>
  );
});
