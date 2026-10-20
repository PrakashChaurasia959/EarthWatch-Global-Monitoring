import { useMemo, useState } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { WorldMap } from '@/components/maps/WorldMap';
import { EventFiltersBar } from './EventFilters';
import { EventTable } from './EventTable';
import { EventDetailPanel } from './EventDetailPanel';
import { Button } from '@/components/ui/Button';
import { StatusDot } from '@/components/ui/StatusDot';
import { Spinner } from '@/components/ui/Skeleton';
import { applyEventFilters, DEFAULT_FILTERS, type EventFilters } from '@/utils/filters';
import { ALL_CATEGORIES } from '@/utils/categories';
import { timeAgo, formatDateTime } from '@/utils/date';
import { useNow } from '@/hooks/useNow';
import type { NormalizedEvent, EventCategory } from '@/types/common';
import type { GibsLayer } from '@/types/nasa';

interface Props {
  events: NormalizedEvent[];
  loading: boolean;
  error: string | null;
  stale: boolean;
  status: 'ok' | 'error' | 'idle' | 'loading';
  lastUpdated: number | null;
  onRefresh: () => void;
  availableCategories?: EventCategory[];
  showMagnitudeFilter?: boolean;
  mapHeight?: string;
  mapCenter?: [number, number];
  mapZoom?: number;
  attribution: string;
  /** Optional satellite imagery overlay for the map. */
  gibs?: GibsLayer;
  emptyWhenNoConfig?: { title: string; description: string; node?: React.ReactNode };
}

export function EventExplorer({
  events,
  loading,
  error,
  stale,
  status,
  lastUpdated,
  onRefresh,
  availableCategories = ALL_CATEGORIES,
  showMagnitudeFilter = false,
  mapHeight = 'h-[460px]',
  mapCenter = [20, 0],
  mapZoom = 2,
  attribution,
  gibs,
  emptyWhenNoConfig,
}: Props) {
  const [filters, setFilters] = useState<EventFilters>(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<NormalizedEvent | null>(null);
  const now = useNow(30_000);

  const filtered = useMemo(() => applyEventFilters(events, filters), [events, filters]);

  // Active categories for the map: follow filter when set, else all available.
  const activeCategories = useMemo<EventCategory[]>(() => {
    if (filters.categories.length > 0) return filters.categories;
    return availableCategories;
  }, [filters.categories, availableCategories]);

  const [showGibs, setShowGibs] = useState(false);

  return (
    <div className="space-y-4">
      {/* Status header */}
      <div className="flex flex-wrap items-center gap-3 card px-4 py-3">
        <StatusDot status={status} label={stale ? 'Cached' : undefined} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-200">
            {events.length.toLocaleString()} records loaded
          </p>
          <p className="text-[11px] text-slate-500">
            {attribution}
            {lastUpdated ? ` · updated ${timeAgo(lastUpdated, now)} (${formatDateTime(lastUpdated)})` : ''}
          </p>
        </div>
        <Button onClick={onRefresh} loading={loading} variant="outline" size="sm" icon={<RefreshCw size={14} />}>
          Refresh
        </Button>
      </div>

      {error && !lastUpdated && (
        <div className="card p-4 flex items-start gap-3 border-accent-rose/20" role="alert">
          <AlertTriangle size={18} className="text-accent-rose shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-200">Data source unavailable</p>
            <p className="text-xs text-slate-400 mt-0.5">{error}</p>
          </div>
          <Button onClick={onRefresh} variant="outline" size="sm">Retry</Button>
        </div>
      )}

      {emptyWhenNoConfig && events.length === 0 && !loading && !error ? (
        <div className="card p-6">{emptyWhenNoConfig.node ?? (
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-200">{emptyWhenNoConfig.title}</p>
            <p className="text-sm text-slate-400 mt-1 max-w-xl mx-auto">{emptyWhenNoConfig.description}</p>
          </div>
        )}</div>
      ) : (
        <>
          <WorldMap
            events={events}
            activeCategories={activeCategories}
            onToggleCategory={(cat) =>
              setFilters((f) => ({ ...f, categories: f.categories.includes(cat) ? f.categories.filter((c) => c !== cat) : [...f.categories, cat] }))
            }
            heightClass={mapHeight}
            center={mapCenter}
            zoom={mapZoom}
            loading={loading}
            gibs={gibs ? { layer: gibs, date: gibs.defaultDate ?? new Date().toISOString().slice(0, 10) } : null}
            showGibs={showGibs}
            onToggleGibs={() => setShowGibs((v) => !v)}
            onSelectEvent={(e) => setSelected(e)}
          />

          <EventFiltersBar
            filters={filters}
            onChange={setFilters}
            resultCount={filtered.length}
            total={events.length}
            availableCategories={availableCategories}
            showMagnitude={showMagnitudeFilter}
          />

          {loading && events.length === 0 ? (
            <div className="card p-8 flex items-center justify-center gap-2 text-slate-400">
              <Spinner size={16} /> Loading events…
            </div>
          ) : (
            <EventTable
              events={filtered}
              onSelect={setSelected}
              selectedId={selected ? `${selected.source}-${selected.id}` : undefined}
              sortField={filters.sortField}
              sortDir={filters.sortDir}
              onSort={(field) =>
                setFilters((f) => ({
                  ...f,
                  sortField: field,
                  sortDir: f.sortField === field ? (f.sortDir === 'asc' ? 'desc' : 'asc') : 'desc',
                }))
              }
            />
          )}
        </>
      )}

      <EventDetailPanel event={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
