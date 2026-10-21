import { useMemo, useState } from 'react';
import { Globe2 } from 'lucide-react';
import { useDataStore } from '@/store/DataContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { WorldMap } from '@/components/maps/WorldMap';
import { EventFiltersBar } from '@/components/events/EventFilters';
import { EventTable } from '@/components/events/EventTable';
import { EventDetailPanel } from '@/components/events/EventDetailPanel';
import { applyEventFilters, DEFAULT_FILTERS, type EventFilters } from '@/utils/filters';
import { ALL_CATEGORIES } from '@/utils/categories';
import { useLang } from '@/i18n/LanguageContext';
import type { NormalizedEvent, EventCategory } from '@/types/common';

export default function WorldMapPage() {
  const { allEvents, earthquakes, eonet, fires } = useDataStore();
  const { t } = useLang();
  const [filters, setFilters] = useState<EventFilters>(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<NormalizedEvent | null>(null);

  const filtered = useMemo(() => applyEventFilters(allEvents, filters), [allEvents, filters]);
  const activeCategories = useMemo<EventCategory[]>(
    () => (filters.categories.length > 0 ? filters.categories : ALL_CATEGORIES),
    [filters.categories],
  );

  const loading = earthquakes.loading || eonet.loading || fires.loading;

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in">
      <PageHeader
        icon={<Globe2 size={18} />}
        title={t('worldmap.title')}
        subtitle={t('worldmap.subtitle')}
      />

      <WorldMap
        events={allEvents}
        activeCategories={activeCategories}
        onToggleCategory={(cat) =>
          setFilters((f) => ({
            ...f,
            categories: f.categories.includes(cat) ? f.categories.filter((c) => c !== cat) : [...f.categories, cat],
          }))
        }
        loading={loading}
        heightClass="h-[60vh] min-h-[420px]"
        onSelectEvent={(e) => setSelected(e)}
      />

      <div className="space-y-3">
        <h2 className="section-title">{t('worldmap.accessibleList')}</h2>
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
      </div>

      <EventDetailPanel event={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
