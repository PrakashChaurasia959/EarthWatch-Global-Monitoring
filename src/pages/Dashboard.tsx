import { useMemo, useState } from 'react';
import { RefreshCw, Info } from 'lucide-react';
import { useDataStore } from '@/store/DataContext';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { MonitoringStatus } from '@/components/dashboard/MonitoringStatus';
import { WorldMap } from '@/components/maps/WorldMap';
import { MagnitudeDistribution } from '@/components/charts/MagnitudeDistribution';
import { EventCategoryChart } from '@/components/charts/EventCategoryChart';
import { EventFiltersBar } from '@/components/events/EventFilters';
import { EventTable } from '@/components/events/EventTable';
import { EventDetailPanel } from '@/components/events/EventDetailPanel';
import { Button } from '@/components/ui/Button';
import { StatusDot } from '@/components/ui/StatusDot';
import { useErrorToast } from '@/components/ui/Toast';
import { applyEventFilters, DEFAULT_FILTERS, type EventFilters } from '@/utils/filters';
import { ALL_CATEGORIES } from '@/utils/categories';
import { timeAgo, formatDateTime } from '@/utils/date';
import { useNow } from '@/hooks/useNow';
import type { NormalizedEvent, EventCategory } from '@/types/common';

export default function Dashboard() {
  const { earthquakes, eonet, fires, allEvents, refreshAll, lastUpdated } = useDataStore();
  const now = useNow(30_000);
  const [filters, setFilters] = useState<EventFilters>(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<NormalizedEvent | null>(null);

  // Surface a single representative error to the toast (don't spam all three).
  const repError = earthquakes.error ?? eonet.error ?? fires.error;
  useErrorToast(repError);

  const filtered = useMemo(() => applyEventFilters(allEvents, filters), [allEvents, filters]);
  const activeCategories = useMemo<EventCategory[]>(
    () => (filters.categories.length > 0 ? filters.categories : ALL_CATEGORIES),
    [filters.categories],
  );

  const anyLoading = earthquakes.loading || eonet.loading || fires.loading;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Hero header */}
      <section className="card p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-space-radial opacity-60 pointer-events-none" aria-hidden="true" />
        <div className="relative flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="pill bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse-soft" /> Live monitoring
              </span>
              <StatusDot status={repError ? 'error' : 'ok'} label={repError ? 'Partial outage' : 'All sources connected'} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
              Monitor Our Planet. Understand Our Earth.
            </h1>
            <p className="mt-2 text-sm text-slate-400 max-w-2xl">
              A real-time view of earthquakes, wildfires, natural events, and satellite imagery from public
              agency data. All counts derive from live API responses — no fabricated data.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button onClick={refreshAll} loading={anyLoading} icon={<RefreshCw size={15} />} variant="primary">
              Refresh all
            </Button>
          </div>
        </div>
        <p className="relative mt-3 text-[11px] text-slate-500">
          Last successful update: {lastUpdated ? `${timeAgo(lastUpdated, now)} · ${formatDateTime(lastUpdated)}` : 'awaiting first fetch'}
        </p>
      </section>

      <SummaryCards />

      {/* Map + monitoring status */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="xl:col-span-2 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Global events map</h2>
            <span className="text-[11px] text-slate-500">USGS · EONET · FIRMS</span>
          </div>
          <WorldMap
            events={allEvents}
            activeCategories={activeCategories}
            onToggleCategory={(cat) =>
              setFilters((f) => ({
                ...f,
                categories: f.categories.includes(cat) ? f.categories.filter((c) => c !== cat) : [...f.categories, cat],
              }))
            }
            loading={anyLoading}
            heightClass="h-[460px] sm:h-[520px]"
            onSelectEvent={(e) => setSelected(e)}
          />
          <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Info size={12} /> An accessible, sortable list of all mapped events appears below the charts.
          </p>
        </div>
        <div className="space-y-4">
          <MonitoringStatus />
          <EventCategoryChart events={allEvents} title="Events by source category" />
        </div>
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <MagnitudeDistribution events={earthquakes.events} />
        <EventCategoryChart events={allEvents} />
      </section>

      {/* Recent events */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="section-title">Recent events</h2>
          <span className="text-[11px] text-slate-500">{allEvents.length.toLocaleString()} total indexed</span>
        </div>
        <EventFiltersBar
          filters={filters}
          onChange={setFilters}
          resultCount={filtered.length}
          total={allEvents.length}
        />
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
      </section>

      <EventDetailPanel event={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
