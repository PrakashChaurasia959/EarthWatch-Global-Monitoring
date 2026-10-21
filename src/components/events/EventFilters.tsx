import { Search, X, ArrowUpDown } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { ALL_CATEGORIES, CATEGORY_META } from '@/utils/categories';
import type { EventFilters, SortField } from '@/utils/filters';
import type { EventCategory } from '@/types/common';
import { Select } from '@/components/ui/Select';
import { useLang } from '@/i18n/LanguageContext';

interface Props {
  filters: EventFilters;
  onChange: (next: EventFilters) => void;
  resultCount: number;
  total: number;
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
  const { t } = useLang();
  void useDebounce(filters.query, 200);

  const toggleCat = (cat: EventCategory) =>
    onChange({
      ...filters,
      categories: filters.categories.includes(cat)
        ? filters.categories.filter((c) => c !== cat)
        : [...filters.categories, cat],
    });

  const clearAll = () =>
    onChange({ query: '', categories: [], minMagnitude: 0, sortField: 'time', sortDir: 'desc', sinceMs: null });

  const hasActiveFilters =
    filters.query.trim() !== '' ||
    filters.categories.length > 0 ||
    filters.minMagnitude > 0 ||
    filters.sinceMs != null;

  const magOptions = [
    { value: 0, label: t('filter.mag0') },
    { value: 2.5, label: t('filter.mag2.5') },
    { value: 4.5, label: t('filter.mag4.5') },
    { value: 5.5, label: t('filter.mag5.5') },
    { value: 6.5, label: t('filter.mag6.5') },
  ];
  const sortOptions = [
    { value: 'time', label: t('filter.sortTime') },
    { value: 'magnitude', label: t('filter.sortMag') },
  ];

  return (
    <div className="card p-3 sm:p-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="relative flex-1 min-w-0">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            placeholder={t('common.searchPlaceholder')}
            className="input pl-9 min-h-[44px]"
            aria-label={t('common.search')}
          />
          {filters.query && (
            <button
              type="button"
              onClick={() => onChange({ ...filters, query: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 min-w-[32px] min-h-[32px]"
              aria-label={t('common.clear')}
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {showMagnitude && (
            <Select
              ariaLabel={t('table.minMagnitude')}
              value={filters.minMagnitude}
              onChange={(v) => onChange({ ...filters, minMagnitude: v as number })}
              options={magOptions}
              className="w-36"
            />
          )}
          <Select
            ariaLabel={t('filter.sortTime')}
            value={filters.sortField}
            onChange={(v) => onChange({ ...filters, sortField: v as SortField })}
            options={sortOptions}
            className="w-40"
          />
          <button
            type="button"
            onClick={() => onChange({ ...filters, sortDir: filters.sortDir === 'asc' ? 'desc' : 'asc' })}
            className="btn btn-outline px-3 py-2.5 min-h-[44px]"
            aria-label={filters.sortDir === 'asc' ? t('table.ascending') : t('table.descending')}
            title={filters.sortDir === 'asc' ? t('table.ascending') : t('table.descending')}
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
              className={`pill border transition-colors min-h-[36px] ${on ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
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
          {resultCount.toLocaleString()} / {total.toLocaleString()}
        </span>
        {hasActiveFilters && (
          <button type="button" onClick={clearAll} className="btn btn-ghost px-2.5 py-1.5 text-xs min-h-[36px]">
            {t('common.clear')}
          </button>
        )}
      </div>
    </div>
  );
}
