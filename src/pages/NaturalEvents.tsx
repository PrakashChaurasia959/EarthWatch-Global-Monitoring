import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CloudLightning, Info } from 'lucide-react';
import { useEonetEvents } from '@/hooks/useEonetEvents';
import { EventExplorer } from '@/components/events/EventExplorer';
import { Select } from '@/components/ui/Select';
import { PageHeader } from '@/components/layout/PageHeader';
import { useErrorToast } from '@/components/ui/Toast';
import { useLang } from '@/i18n/LanguageContext';
import type { EventCategory } from '@/types/common';

const STATUS_OPTIONS = [
  { value: 'open', labelKey: 'events.status.open' },
  { value: 'closed', labelKey: 'events.status.closed' },
  { value: 'all', labelKey: 'events.status.all' },
] as const;

type Status = (typeof STATUS_OPTIONS)[number]['value'];

// Categories surfaced by EONET (earthquakes are covered by the USGS page).
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

/** Map a ?category= value (EONET id or our normalized id) to an EONET API category id. */
function paramToEonetCategory(param: string | null): string | undefined {
  if (!param) return undefined;
  // Accept both EONET ids (severeStorms, floods) and our normalized ids (severeStorms, flood).
  if (param === 'flood') return 'floods';
  if (param === 'wildfire') return 'wildfires';
  if (param === 'volcano') return 'volcanoes';
  if (param === 'landslide') return 'landslides';
  // Pass through known EONET ids directly.
  return param;
}

export default function NaturalEvents() {
  const { t } = useLang();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [status, setStatus] = useState<Status>('open');

  const category = useMemo(() => paramToEonetCategory(categoryParam), [categoryParam]);
  const { events, loading, error, stale, status: resultStatus, lastUpdated, refresh } = useEonetEvents(
    category ?? undefined,
    status,
    500,
  );

  useErrorToast(error, t('error.sourceUnavailable'));

  const onStatusChange = (v: string) => {
    setStatus(v as Status);
    // Keep the category param stable when switching status.
    if (categoryParam) setSearchParams({ category: categoryParam }, { replace: true });
  };

  const titleKey = categoryParam === 'floods' || categoryParam === 'flood'
    ? 'nav.floods'
    : categoryParam === 'severeStorms'
      ? 'nav.storms'
      : 'events.title';

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in">
      <PageHeader
        icon={<CloudLightning size={18} />}
        title={t(titleKey as never)}
        subtitle={t('events.subtitle')}
        action={
          <Select
            ariaLabel={t('events.statusLabel')}
            value={status}
            onChange={onStatusChange}
            options={STATUS_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) }))}
            className="w-44"
          />
        }
      />

      <div className="card p-3 flex items-start gap-2 text-xs text-slate-400">
        <Info size={14} className="text-slate-500 shrink-0 mt-0.5" />
        <p>{t('events.note')}</p>
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
        attribution={t('events.attribution')}
      />

      <p className="text-[11px] text-slate-500">{t('events.footer')}</p>
    </div>
  );
}
