import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CategoryBadge } from '@/components/ui/Badge';
import { ExternalLink, MapPin, Clock, Gauge, Layers, Ruler, ShieldCheck, Lightbulb } from 'lucide-react';
import type { NormalizedEvent } from '@/types/common';
import { formatDateTime, timeAgo } from '@/utils/date';
import { fmtNum } from '@/utils/format';
import { categoryLabel } from '@/utils/categories';
import { useLang } from '@/i18n/LanguageContext';
import { useSpeech } from '@/hooks/useSpeech';

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
    <div className="flex items-start gap-3 py-2 border-b border-slate-200 last:border-0">
      <span className="text-slate-500 mt-0.5">{icon}</span>
      <span className="text-xs text-slate-500 w-28 shrink-0">{label}</span>
      <span className="text-sm text-slate-800 min-w-0 flex-1">{value}</span>
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
  const { t, lang } = useLang();
  const { speak, stop, speaking, supported } = useSpeech();

  if (!event) return null;
  const extra = event.extra ?? {};

  const listen = () => {
    if (speaking) {
      stop();
      return;
    }
    const parts = [
      event.title,
      event.description ? `· ${event.description}` : '',
      event.time ? `· ${formatDateTime(event.time)}` : '',
      event.magnitude != null ? `· ${t('detail.magnitude' as never)} ${fmtNum(event.magnitude, 1)}` : '',
      event.longitude != null && event.latitude != null
        ? `· ${event.latitude.toFixed(2)}, ${event.longitude.toFixed(2)}`
        : '',
    ].filter(Boolean);
    speak(parts.join(' '), lang);
  };

  return (
    <Modal
      open={!!event}
      onClose={onClose}
      size="md"
      title={t('detail.title')}
      footer={
        <>
          {supported && (
            <Button variant="outline" onClick={listen} icon={<Lightbulb size={15} />}>
              {speaking ? t('common.stopListening') : t('common.listen')}
            </Button>
          )}
          {event.url ? (
            <a href={event.url} target="_blank" rel="noreferrer noopener" className="btn btn-primary">
              <ExternalLink size={15} /> {t('common.viewSource')}
            </a>
          ) : undefined}
        </>
      }
    >
      <div className="mb-4">
        <CategoryBadge category={event.category} />
        <h2 className="mt-2 text-lg font-semibold text-slate-900 leading-snug">{event.title}</h2>
        {event.description && <p className="mt-1 text-sm text-slate-600">{event.description}</p>}
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3">
        <DetailRow
          icon={<Clock size={15} />}
          label={t('detail.detected')}
          value={
            <span>
              {event.time ? formatDateTime(event.time) : t('detail.unknown')}
              <span className="text-slate-400 ml-2">{event.time ? `(${timeAgo(event.time)})` : ''}</span>
            </span>
          }
        />
        {event.longitude != null && event.latitude != null && (
          <DetailRow
            icon={<MapPin size={15} />}
            label={t('detail.coords')}
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
            label={event.source === 'usgs' ? t('detail.magnitude') : t('detail.value')}
            value={
              <span className="font-semibold">
                {fmtNum(event.magnitude, 1)} <span className="text-slate-500 text-xs">{event.magnitudeUnit ?? ''}</span>
              </span>
            }
          />
        )}
        {event.depth != null && (
          <DetailRow icon={<Ruler size={15} />} label={t('detail.depth')} value={`${fmtNum(event.depth, 1)} ${t('detail.km')}`} />
        )}
        {event.confidence != null && (
          <DetailRow icon={<ShieldCheck size={15} />} label={t('detail.confidence')} value={`${event.confidence}%`} />
        )}
        {extra.categoryTitle && (
          <DetailRow icon={<Layers size={15} />} label={t('detail.category')} value={String(extra.categoryTitle)} />
        )}
        {extra.geometries != null && (
          <DetailRow icon={<Layers size={15} />} label={t('detail.geometries')} value={`${extra.geometries} ${t('detail.observations')}`} />
        )}
        {extra.satellite && (
          <DetailRow icon={<Layers size={15} />} label={t('detail.satellite')} value={String(extra.satellite)} />
        )}
        {event.sourceIds && event.sourceIds.length > 0 && (
          <DetailRow icon={<Layers size={15} />} label={t('detail.reportedBy')} value={event.sourceIds.join(', ')} />
        )}
        {extra.acqDate && (
          <DetailRow icon={<Clock size={15} />} label={t('detail.acquired')} value={`${extra.acqDate} ${extra.acqTime ?? ''} UTC`} />
        )}
        {extra.daynight && (
          <DetailRow icon={<Clock size={15} />} label={t('detail.dayNight')} value={extra.daynight === 'N' ? t('detail.night') : t('detail.day')} />
        )}
        {extra.brightTi4 != null && (
          <DetailRow icon={<Gauge size={15} />} label={t('detail.brightTi4')} value={fmtNum(extra.brightTi4 as number, 1)} />
        )}
        {extra.frp != null && event.source === 'firms' && (
          <DetailRow icon={<Gauge size={15} />} label={t('detail.firePower')} value={`${fmtNum(event.magnitude, 1)} MW`} />
        )}
        {extra.alert && extra.alert !== 'null' && (
          <DetailRow icon={<ShieldCheck size={15} />} label={t('detail.alert')} value={String(extra.alert)} />
        )}
        {extra.tsunami === 'yes' && (
          <DetailRow icon={<ShieldCheck size={15} />} label={t('detail.tsunami')} value={t('detail.tsunamiFlag')} />
        )}
        {event.closed && extra.closedDate && (
          <DetailRow icon={<Clock size={15} />} label={t('detail.closed')} value={String(extra.closedDate)} />
        )}
      </div>

      <p className="mt-3 text-[11px] text-slate-500">
        {categoryLabel(event.category)} · {t('detail.source')}: {event.source.toUpperCase()}
      </p>
    </Modal>
  );
}
