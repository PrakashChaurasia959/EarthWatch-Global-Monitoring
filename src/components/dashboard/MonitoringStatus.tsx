import { useState } from 'react';
import { ChevronDown, Activity } from 'lucide-react';
import { useDataStore } from '@/store/DataContext';
import { useNow } from '@/hooks/useNow';
import { StatusDot } from '@/components/ui/StatusDot';
import { timeAgo, formatDateTime } from '@/utils/date';
import { USING_DEMO_KEY, FIRMS_CONFIGURED } from '@/config/env';

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
  const [open, setOpen] = useState(true);

  const rows: SourceRow[] = [
    {
      name: 'USGS Earthquakes',
      description: 'earthquake.usgs.gov · past 24h summary feed',
      status: earthquakes.status,
      lastUpdated: earthquakes.lastUpdated,
      stale: earthquakes.stale,
      recordCount: earthquakes.events.length,
      error: earthquakes.error,
    },
    {
      name: 'NASA EONET',
      description: 'eonet.gsfc.nasa.gov/api/v3 · open events',
      status: eonet.status,
      lastUpdated: eonet.lastUpdated,
      stale: eonet.stale,
      recordCount: eonet.events.length,
      error: eonet.error,
    },
    {
      name: 'NASA FIRMS',
      description: 'firms.modaps.eosdis.nasa.gov · active fire detections',
      status: fires.configured ? fires.status : 'idle',
      lastUpdated: fires.lastUpdated,
      stale: fires.stale,
      recordCount: fires.events.length,
      error: fires.error,
      notConfigured: !fires.configured,
    },
    {
      name: 'NASA GIBS',
      description: 'gibs.earthdata.nasa.gov · public imagery tiles (no key)',
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
        className="w-full flex items-center justify-between gap-2"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <Activity size={16} className="text-accent-cyan" />
          <h3 className="text-sm font-semibold text-slate-100">Monitoring status</h3>
        </span>
        <span className="flex items-center gap-3">
          <span className="text-[11px] text-slate-500">
            Last update {lastUpdated ? timeAgo(lastUpdated, now) : '—'}
          </span>
          <ChevronDown
            size={16}
            className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          />
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
                  <span className="text-accent-amber">Not configured</span>
                ) : r.error && !r.lastUpdated ? (
                  <span className="text-accent-rose">Unavailable</span>
                ) : r.error && r.lastUpdated ? (
                  <span className="text-accent-amber" title={r.error}>
                    Stale · {r.recordCount} cached
                  </span>
                ) : (
                  <span>
                    {r.recordCount > 0 ? `${r.recordCount} records` : 'Connected'}
                    <br />
                    {r.lastUpdated ? (
                      <span className="text-slate-600">{formatDateTime(r.lastUpdated)}</span>
                    ) : null}
                  </span>
                )}
              </div>
            </div>
          ))}
          <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
            A failed request never shows as zero events — it appears as “Unavailable” or “Stale”.
            {USING_DEMO_KEY && ' NASA APOD is using the shared DEMO_KEY (rate-limited).'}
            {!FIRMS_CONFIGURED && ' FIRMS fire detections need a free MAP_KEY (see About / README).'}
          </p>
        </div>
      )}
    </div>
  );
}
