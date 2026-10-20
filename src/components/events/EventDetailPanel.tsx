import { Modal } from '@/components/ui/Modal';
import { CategoryBadge } from '@/components/ui/Badge';
import { ExternalLink, MapPin, Clock, Gauge, Layers, Ruler, ShieldCheck } from 'lucide-react';
import type { NormalizedEvent } from '@/types/common';
import { formatDateTime, timeAgo } from '@/utils/date';
import { fmtNum } from '@/utils/format';
import { categoryLabel } from '@/utils/categories';

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
      <span className="text-slate-500 mt-0.5">{icon}</span>
      <span className="text-xs text-slate-500 w-28 shrink-0">{label}</span>
      <span className="text-sm text-slate-200 min-w-0 flex-1">{value}</span>
    </div>
  );
}

export function EventDetailPanel({
  event,
  onClose,
}: {
  event: NormalizedEvent | null;
  onClose: () => void;
}) {
  if (!event) return null;
  const extra = event.extra ?? {};

  return (
    <Modal
      open={!!event}
      onClose={onClose}
      size="md"
      title="Event details"
      footer={
        event.url ? (
          <a href={event.url} target="_blank" rel="noreferrer noopener" className="btn btn-primary">
            <ExternalLink size={15} /> View source
          </a>
        ) : undefined
      }
    >
      <div className="mb-4">
        <CategoryBadge category={event.category} />
        <h2 className="mt-2 text-lg font-semibold text-slate-100 leading-snug">{event.title}</h2>
        {event.description && <p className="mt-1 text-sm text-slate-400">{event.description}</p>}
      </div>

      <div className="rounded-xl border border-white/5 bg-space-900/40 px-3">
        <DetailRow
          icon={<Clock size={15} />}
          label="Detected"
          value={
            <span>
              {event.time ? formatDateTime(event.time) : 'Unknown'}
              <span className="text-slate-500 ml-2">{event.time ? `(${timeAgo(event.time)})` : ''}</span>
            </span>
          }
        />
        {event.longitude != null && event.latitude != null && (
          <DetailRow
            icon={<MapPin size={15} />}
            label="Coordinates"
            value={
              <span className="font-mono text-xs">
                {event.latitude.toFixed(4)}°, {event.longitude.toFixed(4)}°
              </span>
            }
          />
        )}
        {event.magnitude != null && (
          <DetailRow
            icon={<Gauge size={15} />}
            label={event.source === 'usgs' ? 'Magnitude' : 'Value'}
            value={
              <span className="font-semibold">
                {fmtNum(event.magnitude, event.source === 'usgs' ? 1 : 1)}{' '}
                <span className="text-slate-500 text-xs">{event.magnitudeUnit ?? ''}</span>
              </span>
            }
          />
        )}
        {event.depth != null && (
          <DetailRow icon={<Ruler size={15} />} label="Depth" value={`${fmtNum(event.depth, 1)} km`} />
        )}
        {event.confidence != null && (
          <DetailRow
            icon={<ShieldCheck size={15} />}
            label="Confidence"
            value={`${event.confidence}%`}
          />
        )}
        {extra.categoryTitle && (
          <DetailRow icon={<Layers size={15} />} label="Category" value={String(extra.categoryTitle)} />
        )}
        {extra.geometries != null && (
          <DetailRow
            icon={<Layers size={15} />}
            label="Geometries"
            value={`${extra.geometries} observation(s)`}
          />
        )}
        {extra.satellite && (
          <DetailRow icon={<Layers size={15} />} label="Satellite" value={String(extra.satellite)} />
        )}
        {event.sourceIds && event.sourceIds.length > 0 && (
          <DetailRow icon={<Layers size={15} />} label="Reported by" value={event.sourceIds.join(', ')} />
        )}
        {extra.acqDate && (
          <DetailRow icon={<Clock size={15} />} label="Acquired" value={`${extra.acqDate} ${extra.acqTime ?? ''} UTC`} />
        )}
        {extra.daynight && (
          <DetailRow icon={<Clock size={15} />} label="Day/Night" value={extra.daynight === 'N' ? 'Night' : 'Day'} />
        )}
        {extra.brightTi4 != null && (
          <DetailRow icon={<Gauge size={15} />} label="Bright TI4" value={fmtNum(extra.brightTi4 as number, 1)} />
        )}
        {extra.frp != null && event.source === 'firms' && (
          <DetailRow icon={<Gauge size={15} />} label="Fire power" value={`${fmtNum(event.magnitude, 1)} MW`} />
        )}
        {extra.alert && extra.alert !== 'null' && (
          <DetailRow icon={<ShieldCheck size={15} />} label="PAGER alert" value={String(extra.alert)} />
        )}
        {extra.tsunami === 'yes' && (
          <DetailRow icon={<ShieldCheck size={15} />} label="Tsunami" value="Potential — flagged by USGS" />
        )}
        {event.closed && extra.closedDate && (
          <DetailRow icon={<Clock size={15} />} label="Closed" value={String(extra.closedDate)} />
        )}
      </div>

      <p className="mt-3 text-[11px] text-slate-500">
        Category: {categoryLabel(event.category)} · Source: {event.source.toUpperCase()}
      </p>
    </Modal>
  );
}
