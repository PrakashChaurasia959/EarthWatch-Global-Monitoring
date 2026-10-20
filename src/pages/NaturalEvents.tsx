import { useState } from 'react';
import { CloudLightning, Info } from 'lucide-react';
import { useEonetEvents } from '@/hooks/useEonetEvents';
import { EventExplorer } from '@/components/events/EventExplorer';
import { Select } from '@/components/ui/Select';
import { PageHeader } from '@/components/layout/PageHeader';
import { useErrorToast } from '@/components/ui/Toast';
import type { EventCategory } from '@/types/common';

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open (active)' },
  { value: 'closed', label: 'Closed (recent)' },
  { value: 'all', label: 'Open + closed' },
] as const;

type Status = (typeof STATUS_OPTIONS)[number]['value'];

// Categories actually surfaced by EONET (earthquakes are covered by USGS page).
const EONET_CATEGORIES: EventCategory[] = [
  'wildfire',
  'volcano',
  'severeStorms',
  'flood',
  'landslide',
  'drought',
  'dustHaze',
  'seaLakeIce',
  'snow',
  'tempExtremes',
  'waterColor',
  'manmade',
  'other',
];

export default function NaturalEvents() {
  const [status, setStatus] = useState<Status>('open');
  const { events, loading, error, stale, status: resultStatus, lastUpdated, refresh } = useEonetEvents(
    undefined,
    status,
    500,
  );

  useErrorToast(error, 'NASA EONET feed error');

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in">
      <PageHeader
        icon={<CloudLightning size={18} />}
        title="Natural Events"
        subtitle="NASA EONET — near-real-time events across severe storms, volcanoes, floods, and more"
        action={
          <Select
            ariaLabel="Event status"
            value={status}
            onChange={(v) => setStatus(v as Status)}
            options={STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
            className="w-44"
          />
        }
      />

      <div className="card p-3 flex items-start gap-2 text-xs text-slate-400">
        <Info size={14} className="text-slate-500 shrink-0 mt-0.5" />
        <p>
          EONET aggregates events from many sources. An “open” event is one EONET still considers active.
          Some events carry multiple geometries (e.g. a storm track); the map plots the most recent point.
          EONET is not an official emergency-warning service.
        </p>
      </div>

      <EventExplorer
        events={events}
        loading={loading}
        error={error}
        stale={stale}
        status={resultStatus}
        lastUpdated={lastUpdated}
        onRefresh={refresh}
        availableCategories={EONET_CATEGORIES}
        mapHeight="h-[440px] sm:h-[520px]"
        attribution="NASA EONET v3 (eonet.gsfc.nasa.gov/api/v3)"
      />

      <p className="text-[11px] text-slate-500">
        Events © NASA EONET. Source identifiers and links are preserved in each event's detail panel.
        Events without usable coordinates are omitted from the map but remain searchable in the table.
      </p>
    </div>
  );
}
