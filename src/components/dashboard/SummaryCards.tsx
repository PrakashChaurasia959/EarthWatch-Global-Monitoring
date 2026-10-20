import type { ReactNode } from 'react';
import { Waves, Flame, CloudLightning, Satellite } from 'lucide-react';
import { useDataStore } from '@/store/DataContext';
import { GIBS_LAYERS } from '@/services/gibs';
import { StatusDot } from '@/components/ui/StatusDot';
import { Skeleton } from '@/components/ui/Skeleton';
import { fmtInt } from '@/utils/format';

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
          className="inline-flex items-center justify-center w-9 h-9 rounded-xl border"
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

  const fireCount = fires.events.length;
  const fireStatus = fires.configured ? fires.status : 'idle';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      <SummaryCard
        label="Earthquakes"
        value={fmtInt(earthquakes.events.length)}
        source="USGS · past 24h feed"
        status={earthquakes.status}
        stale={earthquakes.stale}
        loading={earthquakes.loading && earthquakes.events.length === 0}
        icon={<Waves size={18} />}
        accent="#22d3ee"
        hint={
          earthquakes.error
            ? 'Source unavailable'
            : earthquakes.events.length > 0
              ? `Largest: M ${Math.max(...earthquakes.events.map((e) => e.magnitude ?? 0)).toFixed(1)}`
              : 'Awaiting data'
        }
      />
      <SummaryCard
        label="Active fire detections"
        value={fires.configured ? fmtInt(fireCount) : '—'}
        source={fires.configured ? 'NASA FIRMS · last 24h' : 'FIRMS not configured'}
        status={fireStatus}
        stale={fires.stale}
        loading={fires.loading && fires.events.length === 0}
        icon={<Flame size={18} />}
        accent="#fb7185"
        hint={fires.configured ? (fires.error ? 'Source unavailable' : 'Near-real-time detections') : 'Add VITE_FIRMS_MAP_KEY'}
      />
      <SummaryCard
        label="Open natural events"
        value={fmtInt(eonet.events.length)}
        source="NASA EONET · open events"
        status={eonet.status}
        stale={eonet.stale}
        loading={eonet.loading && eonet.events.length === 0}
        icon={<CloudLightning size={18} />}
        accent="#a78bfa"
        hint={eonet.error ? 'Source unavailable' : `${new Set(eonet.events.map((e) => e.category)).size} categories tracked`}
      />
      <SummaryCard
        label="Satellite imagery layers"
        value={fmtInt(GIBS_LAYERS.length)}
        source="NASA GIBS · public WMTS"
        status="ok"
        icon={<Satellite size={18} />}
        accent="#34d399"
        hint="No key required · plus NASA APOD"
      />
    </div>
  );
}
