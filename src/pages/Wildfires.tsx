import { useMemo, useState } from 'react';
import { Flame, AlertTriangle, KeyRound } from 'lucide-react';
import { useFires } from '@/hooks/useFirms';
import { useEonetEvents } from '@/hooks/useEonetEvents';
import { EventExplorer } from '@/components/events/EventExplorer';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { useErrorToast } from '@/components/ui/Toast';
import { useLang } from '@/i18n/LanguageContext';
import { FIRMS_CONFIGURED } from '@/config/env';
import { GIBS_LAYERS } from '@/services/gibs';
import type { FirmsSource } from '@/types/firms';
import type { NormalizedEvent } from '@/types/common';

const SOURCES: FirmsSource[] = ['VIIRS_SNPP', 'VIIRS_NOAA20', 'MODIS'];
const DAYS = [1, 2, 3];

const smokeContextLayer = GIBS_LAYERS.find((l) => l.id === 'MODIS_Terra_CorrectedReflectance_TrueColor');

export default function Wildfires() {
  const { t } = useLang();
  const [source, setSource] = useState<FirmsSource>('VIIRS_SNPP');
  const [days, setDays] = useState<number>(1);

  const fires = useFires(source, days);
  const eonetFires = useEonetEvents('wildfires', 'open', 300);

  useErrorToast(fires.configured ? fires.error : null, t('error.sourceUnavailable'));
  useErrorToast(eonetFires.error, t('error.sourceUnavailable'));

  const combined: NormalizedEvent[] = useMemo(
    () => [...fires.events, ...eonetFires.events],
    [fires.events, eonetFires.events],
  );

  const loading = (fires.configured && fires.loading) || eonetFires.loading;
  const error = fires.configured && fires.error && !fires.lastUpdated ? fires.error : null;
  const stale = fires.stale || eonetFires.stale;
  const lastUpdated = fires.lastUpdated ?? eonetFires.lastUpdated;
  const status: 'ok' | 'error' | 'idle' | 'loading' = fires.configured
    ? fires.status === 'error' && eonetFires.status === 'error'
      ? 'error'
      : 'ok'
    : 'ok';

  const refresh = () => {
    fires.refresh();
    eonetFires.refresh();
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in">
      <PageHeader
        icon={<Flame size={18} />}
        title={t('fire.title')}
        subtitle={t('fire.subtitle')}
        action={
          <div className="flex items-center gap-2 flex-wrap">
            <Select
              ariaLabel={t('fire.detectionSource')}
              value={source}
              onChange={(v) => setSource(v as FirmsSource)}
              options={SOURCES.map((s) => ({ value: s, label: t(`fire.source.${s}` as never) }))}
              className="w-44"
              disabled={!FIRMS_CONFIGURED}
            />
            <Select
              ariaLabel={t('fire.lookback')}
              value={days}
              onChange={(v) => setDays(v as number)}
              options={DAYS.map((d) => ({ value: d, label: t(`fire.days.${d}` as never) }))}
              className="w-40"
              disabled={!FIRMS_CONFIGURED}
            />
          </div>
        }
      />

      {!FIRMS_CONFIGURED && (
        <div className="card p-4 sm:p-5 border-accent-amber/25" role="status">
          <div className="flex items-start gap-3">
            <KeyRound size={20} className="text-accent-amber shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-100">{t('fire.notConfiguredTitle')}</p>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">{t('fire.notConfiguredDesc')}</p>
              <ol className="mt-3 space-y-1 text-xs text-slate-400 list-decimal list-inside">
                <li>{t('fire.step1')}</li>
                <li>{t('fire.step2')}</li>
                <li>{t('fire.step3')}</li>
                <li>{t('fire.step4')}</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {FIRMS_CONFIGURED && fires.error && !fires.lastUpdated && (
        <div className="card p-4 flex items-start gap-3 border-accent-rose/20" role="alert">
          <AlertTriangle size={18} className="text-accent-rose shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-200">{t('fire.firmsFailedTitle')}</p>
            <p className="text-xs text-slate-400 mt-0.5">{fires.error}</p>
            <p className="text-xs text-slate-400 mt-1">{t('fire.firmsFailedNote')}</p>
          </div>
          <Button onClick={refresh} variant="outline" size="sm">
            {t('common.retry')}
          </Button>
        </div>
      )}

      <EventExplorer
        events={combined}
        loading={loading}
        error={error}
        stale={stale}
        status={status}
        lastUpdated={lastUpdated}
        onRefresh={refresh}
        availableCategories={['wildfire']}
        mapHeight="h-[440px] sm:h-[520px]"
        attribution={FIRMS_CONFIGURED ? t('fire.attrConfigured') : t('fire.attrFallback')}
        gibs={smokeContextLayer}
        emptyWhenNoConfig={{
          title: t('fire.empty.title'),
          description: t('fire.empty.desc'),
        }}
      />

      <div className="card p-4">
        <h3 className="text-sm font-semibold text-slate-100 mb-2">{t('fire.aboutData')}</h3>
        <ul className="space-y-1.5 text-xs text-slate-400 list-disc list-inside">
          <li>{t('fire.about1')}</li>
          <li>{t('fire.about2')}</li>
          <li>{t('fire.about3')}</li>
          <li>{t('fire.about4')}</li>
        </ul>
      </div>
    </div>
  );
}
