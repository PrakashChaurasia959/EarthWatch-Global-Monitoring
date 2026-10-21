import { useMemo, useState } from 'react';
import { Waves } from 'lucide-react';
import { useEarthquakes } from '@/hooks/useEarthquakes';
import { EventExplorer } from '@/components/events/EventExplorer';
import { MagnitudeDistribution } from '@/components/charts/MagnitudeDistribution';
import { Select } from '@/components/ui/Select';
import { useErrorToast } from '@/components/ui/Toast';
import { PageHeader } from '@/components/layout/PageHeader';
import { useLang } from '@/i18n/LanguageContext';
import type { QuakeWindow } from '@/types/earthquake';
import { MAGNITUDE_BANDS } from '@/utils/format';

const WINDOW_KEYS = ['hour', 'day', 'week', 'month'] as const;

export default function Earthquakes() {
  const { t } = useLang();
  const [window, setWindow] = useState<QuakeWindow>('day');
  const { events, loading, error, stale, status, lastUpdated, generated, refresh } = useEarthquakes(window, 0);

  useErrorToast(error, t('error.sourceUnavailable'));

  const largest = useMemo(() => {
    if (events.length === 0) return null;
    return events.reduce(
      (max, e) => ((e.magnitude ?? -Infinity) > (max.magnitude ?? -Infinity) ? e : max),
      events[0],
    );
  }, [events]);

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in">
      <PageHeader
        icon={<Waves size={18} />}
        title={t('eq.title')}
        subtitle={t('eq.subtitle')}
        action={
          <Select
            ariaLabel={t('eq.window.day')}
            value={window}
            onChange={(v) => setWindow(v as QuakeWindow)}
            options={WINDOW_KEYS.map((w) => ({ value: w, label: t(`eq.window.${w}` as never) }))}
            className="w-44"
          />
        }
      />

      {/* Magnitude legend */}
      <div className="card p-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
          <span className="text-slate-500 font-medium">{t('eq.magLegend')}:</span>
          {MAGNITUDE_BANDS.map((b) => (
            <span key={b.label} className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color, boxShadow: `0 0 6px ${b.glow}` }} />
              {b.label}
            </span>
          ))}
          <span className="ml-auto text-[11px] text-slate-500">
            {largest ? `${t('eq.largest')}: M ${largest.magnitude?.toFixed(2)} · ${largest.title}` : ''}
          </span>
        </div>
      </div>

      <EventExplorer
        events={events}
        loading={loading}
        error={error}
        stale={stale}
        status={status}
        lastUpdated={lastUpdated ?? generated}
        onRefresh={refresh}
        availableCategories={['earthquake']}
        showMagnitudeFilter
        mapHeight="h-[440px] sm:h-[520px]"
        attribution={t('eq.attribution')}
      />

      <MagnitudeDistribution events={events} />

      <p className="text-[11px] text-slate-500">{t('eq.note')}</p>
    </div>
  );
}
