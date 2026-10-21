import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useDataStore } from '@/store/DataContext';
import { useDebounce } from '@/hooks/useDebounce';
import { CategoryBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDateTime, timeAgo } from '@/utils/date';
import { categoryLabel } from '@/utils/categories';
import { useLang } from '@/i18n/LanguageContext';
import type { NormalizedEvent } from '@/types/common';

function matches(event: NormalizedEvent, q: string): boolean {
  if (!q) return true;
  const hay = `${event.title} ${event.description ?? ''} ${categoryLabel(event.category)}`.toLowerCase();
  return hay.includes(q);
}

export function GlobalSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { allEvents } = useDataStore();
  const { t } = useLang();
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 150);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const results = useMemo<NormalizedEvent[]>(() => {
    const q = debounced.trim().toLowerCase();
    if (!q) return [];
    return allEvents
      .filter((e) => matches(e, q))
      .sort((a, b) => (b.time ?? 0) - (a.time ?? 0))
      .slice(0, 40);
  }, [allEvents, debounced]);

  const onSelect = (e: NormalizedEvent) => {
    onClose();
    const dest = e.source === 'usgs' ? '/earthquakes' : e.source === 'firms' ? '/wildfires' : '/natural-events';
    navigate(dest);
  };

  return (
    <Modal open={open} onClose={onClose} size="md" title={t('common.search')}>
      <div className="space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('common.searchPlaceholder')}
            className="input pl-9"
            aria-label={t('common.search')}
          />
        </div>

        <p className="text-xs text-slate-500">{t('empty.searchHint')}</p>

        {query.trim() === '' ? (
          <EmptyState icon={<Search size={28} />} title={t('empty.startTyping')} description={t('empty.searchHint')} />
        ) : results.length === 0 ? (
          <EmptyState title={t('empty.noMatches')} description={t('empty.noMatchesDesc')} />
        ) : (
          <ul className="space-y-1.5 max-h-[46vh] overflow-y-auto pr-1">
            {results.map((e) => (
              <li key={`${e.source}-${e.id}`}>
                <button
                  type="button"
                  onClick={() => onSelect(e)}
                  className="w-full text-left rounded-xl px-3 py-3 hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors flex items-center gap-3"
                >
                  <CategoryBadge category={e.category} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-slate-200">{e.title}</span>
                    <span className="block text-[11px] text-slate-500">
                      {e.time ? formatDateTime(e.time) : t('detail.dateUnknown')}
                    </span>
                  </span>
                  <span className="text-[11px] text-slate-500 hidden sm:inline">{e.time ? timeAgo(e.time) : ''}</span>
                  <ArrowRight size={14} className="text-slate-500 shrink-0" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}
