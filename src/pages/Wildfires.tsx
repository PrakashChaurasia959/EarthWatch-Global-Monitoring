import { useMemo, useState } from 'react';
import { Flame, AlertTriangle, KeyRound } from 'lucide-react';
import { useFires } from '@/hooks/useFirms';
import { useEonetEvents } from '@/hooks/useEonetEvents';
import { EventExplorer } from '@/components/events/EventExplorer';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { useErrorToast } from '@/components/ui/Toast';
import { FIRMS_CONFIGURED } from '@/config/env';
import { GIBS_LAYERS } from '@/services/gibs';
import type { FirmsSource } from '@/types/firms';
import type { NormalizedEvent } from '@/types/common';

const SOURCES: { value: FirmsSource; label: string }[] = [
  { value: 'VIIRS_SNPP', label: 'VIIRS Suomi-NPP' },
  { value: 'VIIRS_NOAA20', label: 'VIIRS NOAA-20' },
  { value: 'MODIS', label: 'MODIS Terra/Aqua' },
];

const DAYS: { value: number; label: string }[] = [
  { value: 1, label: 'Last 24 hours' },
  { value: 2, label: 'Last 48 hours' },
  { value: 3, label: 'Last 72 hours' },
];

// Raster MODIS true-color overlay lets users see smoke plumes near fire markers.
// (GIBS thermal-anomaly layers are now vector tiles, so we use a raster layer.)
const smokeContextLayer = GIBS_LAYERS.find((l) => l.id === 'MODIS_Terra_CorrectedReflectance_TrueColor');

export default function Wildfires() {
  const [source, setSource] = useState<FirmsSource>('VIIRS_SNPP');
  const [days, setDays] = useState<number>(1);

  const fires = useFires(source, days);
  const eonetFires = useEonetEvents('wildfires', 'open', 300);

  useErrorToast(fires.configured ? fires.error : null, 'FIRMS fire feed error');
  useErrorToast(eonetFires.error, 'EONET wildfire feed error');

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
        title="Wildfires"
        subtitle="Active fire detections from NASA FIRMS and wildfire events from NASA EONET"
        action={
          <div className="flex items-center gap-2 flex-wrap">
            <Select
              ariaLabel="Detection source"
              value={source}
              onChange={(v) => setSource(v as FirmsSource)}
              options={SOURCES}
              className="w-44"
              disabled={!FIRMS_CONFIGURED}
            />
            <Select
              ariaLabel="Look-back period"
              value={days}
              onChange={(v) => setDays(v as number)}
              options={DAYS}
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
              <p className="text-sm font-semibold text-slate-100">NASA FIRMS not configured</p>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Near-real-time fire detections require a free FIRMS MAP_KEY. The page below is still showing
                real, public wildfire events from NASA EONET so you can explore the data. Add a key to enable
                FIRMS high-resolution active-fire detections.
              </p>
              <ol className="mt-3 space-y-1 text-xs text-slate-400 list-decimal list-inside">
                <li>Register at firms.modaps.eosdis.nasa.gov/api/map_key/ to get a MAP_KEY.</li>
                <li>Create a <code className="text-accent-cyan">.env</code> file and set <code className="text-accent-cyan">VITE_FIRMS_MAP_KEY=</code> to your key.</li>
                <li>The MAP_KEY is a usage-tracking token meant for client request URLs — safe to expose in the browser.</li>
                <li>Restart the dev server, then refresh this page.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {FIRMS_CONFIGURED && fires.error && !fires.lastUpdated && (
        <div className="card p-4 flex items-start gap-3 border-accent-rose/20" role="alert">
          <AlertTriangle size={18} className="text-accent-rose shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-200">FIRMS request failed</p>
            <p className="text-xs text-slate-400 mt-0.5">{fires.error}</p>
            <p className="text-xs text-slate-400 mt-1">Showing EONET wildfire events where available.</p>
          </div>
          <Button onClick={refresh} variant="outline" size="sm">Retry</Button>
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
        attribution={
          FIRMS_CONFIGURED
            ? 'NASA FIRMS (active fire detections) + NASA EONET (wildfire events)'
            : 'NASA EONET wildfire events (FIRMS not configured)'
        }
        gibs={smokeContextLayer}
        emptyWhenNoConfig={{
          title: 'No wildfire events available',
          description:
            'Neither FIRMS nor EONET returned wildfire records in this session. Try refreshing, or check the live source pages linked in About.',
        }}
      />

      <div className="card p-4">
        <h3 className="text-sm font-semibold text-slate-100 mb-2">About this data</h3>
        <ul className="space-y-1.5 text-xs text-slate-400 list-disc list-inside">
          <li><b>FIRMS</b> provides near-real-time active fire detections from MODIS and VIIRS, including brightness, confidence, and fire radiative power.</li>
          <li><b>EONET wildfires</b> aggregates wildfire events from multiple sources; coordinates mark an event, not every individual detection.</li>
          <li>Detection confidence and FRP are shown in the event detail panel where supplied.</li>
          <li>EONET is not an official emergency-warning system and may lag real-time activity.</li>
        </ul>
      </div>
    </div>
  );
}
