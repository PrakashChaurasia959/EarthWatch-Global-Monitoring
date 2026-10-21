import { useState } from 'react';
import { ChevronDown, Activity } from 'lucide-react';
import { useDataStore } from '@/store/DataContext';
import { useNow } from '@/hooks/useNow';
import { StatusDot } from '@/components/ui/StatusDot';
import { timeAgo, formatDateTime } from '@/utils/date';
import { USING_DEMO_KEY, FIRMS_CONFIGURED } from '@/config/env';
import { useLang } from '@/i18n/LanguageContext';

interface SourceRow {
  name: string;
  description: string;
  status: 'ok' | 'error' | 'idle' | 'loading';
  lastUpdated: number | null;
  stale: boolean;
  recordCount: number;
  error?: string | null;
  notConfigured?: boolean;
}

export function MonitoringStatus() {
  const { earthquakes, eonet, fires, lastUpdated } = useDataStore();
  const now = useNow(1000);
  const { t } = useLang();
  const [open, setOpen] = useState(true);

  const rows: SourceRow[] = [
    {
      name: t('monitor.usgs'),
      description: t('monitor.usgsDesc'),
      status: earthquakes.status,
      lastUpdated: earthquakes.lastUpdated,
      stale: earthquakes.stale,
      recordCount: earthquakes.events.length,
      error: earthquakes.error,
    },
    {
      name: t('monitor.eonet'),
      description: t('monitor.eonetDesc'),
      status: eonet.status,
      lastUpdated: eonet.lastUpdated,
      stale: eonet.stale,
      recordCount: eonet.events.length,
      error: eonet.error,
    },
    {
      name: t('monitor.firms'),
      description: t('monitor.firmsDesc'),
      status: fires.configured ? fires.status : 'idle',
      lastUpdated: fires.lastUpdated,
      stale: fires.stale,
      recordCount: fires.events.length,
      error: fires.error,
      notConfigured: !fires.configured,
    },
    {
      name: t('monitor.gibs'),
      description: t('monitor.gibsDesc'),
      status: 'ok',
      lastUpdated: now,
      stale: false,
      recordCount: 0,
    },
  ];

  return (
    <div className="card p-4 sm:p-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 min-h-[44px]"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <Activity size={16} className="text-accent-cyan" />
          <h3 className="text-sm font-semibold text-slate-100">{t('monitor.title')}</h3>
        </span>
        <span className="flex items-center gap-3">
          <span className="text-[11px] text-slate-500">
            {t('status.updated')} {lastUpdated ? timeAgo(lastUpdated, now) : '—'}
          </span>
          <ChevronDown size={16} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {open && (
        <div className="mt-3 space-y-2">
          {rows.map((r) => (
            <div
              key={r.name}
              className="flex items-start gap-3 rounded-xl bg-space-900/50 border border-white/5 px-3 py-2.5"
            >
              <div className="pt-1">
                <StatusDot status={r.status} pulse={r.status !== 'error'} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200">{r.name}</p>
                <p className="text-[11px] text-slate-500">{r.description}</p>
              </div>
              <div className="text-right text-[11px] text-slate-400 shrink-0">
                {r.notConfigured ? (
                  <span className="text-accent-amber">{t('status.notConfigured')}</span>
                ) : r.error && !r.lastUpdated ? (
                  <span className="text-accent-rose">{t('status.unavailable')}</span>
                ) : r.error && r.lastUpdated ? (
                  <span className="text-accent-amber" title={r.error ?? ''}>
                    {t('status.stale')} · {r.recordCount} {t('status.records')}
                  </span>
                ) : (
                  <span>
                    {r.recordCount > 0 ? `${r.recordCount} ${t('status.records')}` : t('status.connected2')}
                    <br />
                    {r.lastUpdated ? <span className="text-slate-600">{formatDateTime(r.lastUpdated)}</span> : null}
                  </span>
                )}
              </div>
            </div>
          ))}
          <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
            {t('monitor.noteFailVsZero')}
            {USING_DEMO_KEY ? ` ${t('sat.apodDemoNote')}` : ''}
            {!FIRMS_CONFIGURED ? ' ' + t('card.firesAddKey') : ''}
          </p>
        </div>
      )}
    </div>
  );
}
