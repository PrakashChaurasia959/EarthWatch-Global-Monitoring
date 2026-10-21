import type { ReactNode } from 'react';
import { Waves, Flame, CloudLightning, Satellite } from 'lucide-react';
import { useDataStore } from '@/store/DataContext';
import { GIBS_LAYERS } from '@/services/gibs';
import { StatusDot } from '@/components/ui/StatusDot';
import { Skeleton } from '@/components/ui/Skeleton';
import { fmtInt } from '@/utils/format';
import { useLang } from '@/i18n/LanguageContext';

interface SummaryCardProps {
  label: string;
  value: ReactNode;
  source: string;
  status: 'ok' | 'error' | 'idle' | 'loading';
  icon: ReactNode;
  accent: string;
  hint?: string;
  stale?: boolean;
  loading?: boolean;
}

function SummaryCard({ label, value, source, status, icon, accent, hint, stale, loading }: SummaryCardProps) {
  return (
    <div className="card p-4 sm:p-5 relative overflow-hidden">
      <div
        className="absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20"
        style={{ background: accent }}
        aria-hidden="true"
      />
      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center justify-center w-10 h-10 rounded-xl border"
          style={{ borderColor: `${accent}55`, color: accent, background: `${accent}14` }}
        >
          {icon}
        </span>
        <StatusDot status={status} label={stale ? 'Cached' : undefined} />
      </div>
      <p className="mt-3 text-2xl sm:text-3xl font-bold text-slate-100 tabular-nums">
        {loading ? <Skeleton className="h-8 w-20" /> : value}
      </p>
      <p className="text-sm font-medium text-slate-300 mt-1">{label}</p>
      <p className="text-[11px] text-slate-500 mt-1.5">{hint ?? source}</p>
    </div>
  );
}

export function SummaryCards() {
  const { earthquakes, eonet, fires } = useDataStore();
  const { t } = useLang();

  const fireCount = fires.events.length;
  const fireStatus = fires.configured ? fires.status : 'idle';
  const largestMag = earthquakes.events.length > 0 ? Math.max(...earthquakes.events.map((e) => e.magnitude ?? 0)) : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      <SummaryCard
        label={t('card.earthquakes')}
        value={fmtInt(earthquakes.events.length)}
        source={t('card.earthquakesSrc')}
        status={earthquakes.status}
        stale={earthquakes.stale}
        loading={earthquakes.loading && earthquakes.events.length === 0}
        icon={<Waves size={20} />}
        accent="#22d3ee"
        hint={
          earthquakes.error
            ? t('card.sourceUnavailable')
            : largestMag != null
              ? `${t('card.largest')} M ${largestMag.toFixed(1)}`
              : t('card.awaitingData')
        }
      />
      <SummaryCard
        label={t('card.fires')}
        value={fires.configured ? fmtInt(fireCount) : '—'}
        source={fires.configured ? t('card.firesSrc') : t('card.firesNotCfg')}
        status={fireStatus}
        stale={fires.stale}
        loading={fires.loading && fires.events.length === 0}
        icon={<Flame size={20} />}
        accent="#fb7185"
        hint={fires.configured ? (fires.error ? t('card.sourceUnavailable') : t('card.firesSrc')) : t('card.firesAddKey')}
      />
      <SummaryCard
        label={t('card.naturalEvents')}
        value={fmtInt(eonet.events.length)}
        source={t('card.naturalEventsSrc')}
        status={eonet.status}
        stale={eonet.stale}
        loading={eonet.loading && eonet.events.length === 0}
        icon={<CloudLightning size={20} />}
        accent="#a78bfa"
        hint={eonet.error ? t('card.sourceUnavailable') : `${new Set(eonet.events.map((e) => e.category)).size} ${t('card.categoriesTracked')}`}
      />
      <SummaryCard
        label={t('card.satellite')}
        value={fmtInt(GIBS_LAYERS.length)}
        source={t('card.satelliteSrc')}
        status="ok"
        icon={<Satellite size={20} />}
        accent="#34d399"
        hint={t('card.satelliteHint')}
      />
    </div>
  );
}
