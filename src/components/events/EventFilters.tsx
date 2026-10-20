import { Search, X, ArrowUpDown } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { ALL_CATEGORIES, CATEGORY_META } from '@/utils/categories';
import type { EventFilters, SortField } from '@/utils/filters';
import type { EventCategory } from '@/types/common';
import { Select } from '@/components/ui/Select';

interface Props {
  filters: EventFilters;
  onChange: (next: EventFilters) => void;
  resultCount: number;
  total: number;
  /** Restrict which categories are shown as chips (some pages are single-source). */
  availableCategories?: EventCategory[];
  showMagnitude?: boolean;
}

export function EventFiltersBar({
  filters,
  onChange,
  resultCount,
  total,
  availableCategories = ALL_CATEGORIES,
  showMagnitude = true,
}: Props) {
  const debouncedQuery = useDebounce(filters.query, 200);
  // We push the debounced query up when it differs so consumers see the
  // debounced value via onChange (used for count display consistency).
  void debouncedQuery;

  const toggleCat = (cat: EventCategory) =>
    onChange({ ...filters, categories: filters.categories.includes(cat) ? filters.categories.filter((c) => c !== cat) : [...filters.categories, cat] });

  const clearAll = () =>
    onChange({ query: '', categories: [], minMagnitude: 0, sortField: 'time', sortDir: 'desc', sinceMs: null });

  const hasActiveFilters =
    filters.query.trim() !== '' ||
    filters.categories.length > 0 ||
    filters.minMagnitude > 0 ||
    filters.sinceMs != null;

  return (
    <div className="card p-3 sm:p-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="relative flex-1 min-w-0">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            placeholder="Search by title or place…"
            className="input pl-9"
            aria-label="Search events"
          />
          {filters.query && (
            <button
              type="button"
              onClick={() => onChange({ ...filters, query: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {showMagnitude && (
            <Select
              ariaLabel="Minimum magnitude"
              value={filters.minMagnitude}
              onChange={(v) => onChange({ ...filters, minMagnitude: v as number })}
              options={[
                { value: 0, label: 'M ≥ 0' },
                { value: 2.5, label: 'M ≥ 2.5' },
                { value: 4.5, label: 'M ≥ 4.5' },
                { value: 5.5, label: 'M ≥ 5.5' },
                { value: 6.5, label: 'M ≥ 6.5' },
              ]}
              className="w-28"
            />
          )}
          <Select
            ariaLabel="Sort field"
            value={filters.sortField}
            onChange={(v) => onChange({ ...filters, sortField: v as SortField })}
            options={[
              { value: 'time', label: 'Sort: Time' },
              { value: 'magnitude', label: 'Sort: Magnitude' },
            ]}
            className="w-36"
          />
          <button
            type="button"
            onClick={() => onChange({ ...filters, sortDir: filters.sortDir === 'asc' ? 'desc' : 'asc' })}
            className="btn btn-outline px-2.5"
            aria-label={`Sort ${filters.sortDir === 'asc' ? 'ascending' : 'descending'}`}
            title={filters.sortDir === 'asc' ? 'Ascending' : 'Descending'}
          >
            <ArrowUpDown size={16} className={filters.sortDir === 'asc' ? 'rotate-180' : ''} />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {availableCategories.map((cat) => {
          const meta = CATEGORY_META[cat];
          const on = filters.categories.includes(cat);
          return (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCat(cat)}
              aria-pressed={on}
              className={`pill border transition-colors ${
                on ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              style={
                on
                  ? { backgroundColor: `${meta.color}26`, borderColor: `${meta.color}66` }
                  : { borderColor: 'rgba(255,255,255,0.1)' }
              }
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
              {meta.label}
            </button>
          );
        })}
        <span className="ml-auto text-xs text-slate-400 tabular-nums">
          {resultCount.toLocaleString()} of {total.toLocaleString()}
        </span>
        {hasActiveFilters && (
          <button type="button" onClick={clearAll} className="btn btn-ghost px-2 py-1 text-xs">
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
