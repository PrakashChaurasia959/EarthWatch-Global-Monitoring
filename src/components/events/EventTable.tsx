import { memo, useState } from 'react';
import { ArrowDown, ArrowUp, ExternalLink } from 'lucide-react';
import type { NormalizedEvent } from '@/types/common';
import { CategoryBadge } from '@/components/ui/Badge';
import { formatDateTime, timeAgo } from '@/utils/date';
import { fmtNum } from '@/utils/format';
import type { SortDir, SortField } from '@/utils/filters';
import { useNow } from '@/hooks/useNow';

interface Props {
  events: NormalizedEvent[];
  onSelect?: (event: NormalizedEvent) => void;
  selectedId?: string;
  sortField: SortField;
  sortDir: SortDir;
  onSort: (field: SortField) => void;
  pageSize?: number;
}

const COLUMNS: { key: SortField | 'category' | 'place'; label: string; sortable: boolean }[] = [
  { key: 'category', label: 'Type', sortable: false },
  { key: 'time', label: 'Time', sortable: true },
  { key: 'place', label: 'Location / Title', sortable: false },
  { key: 'magnitude', label: 'Mag / Value', sortable: true },
];

export const EventTable = memo(function EventTable({
  events,
  onSelect,
  selectedId,
  sortField,
  sortDir,
  onSort,
  pageSize = 25,
}: Props) {
  const now = useNow(60_000);
  const [page, setPage] = useState(0);

  const pageCount = Math.max(1, Math.ceil(events.length / pageSize));
  const current = Math.min(page, pageCount - 1);
  const slice = events.slice(current * pageSize, current * pageSize + pageSize);

  const sortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />;
  };

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-white/5">
              {COLUMNS.map((c) => (
                <th key={c.key} className="font-medium px-3 py-2.5 whitespace-nowrap">
                  {c.sortable ? (
                    <button
                      type="button"
                      onClick={() => onSort(c.key as SortField)}
                      className="inline-flex items-center gap-1 hover:text-slate-200"
                    >
                      {c.label} {sortIcon(c.key as SortField)}
                    </button>
                  ) : (
                    c.label
                  )}
                </th>
              ))}
              <th className="font-medium px-3 py-2.5 text-right">Source</th>
            </tr>
          </thead>
          <tbody>
            {slice.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-sm text-slate-400">
                  No events match the current filters.
                </td>
              </tr>
            ) : (
              slice.map((e) => {
                const active = selectedId === `${e.source}-${e.id}`;
                return (
                  <tr
                    key={`${e.source}-${e.id}`}
                    onClick={() => onSelect?.(e)}
                    className={`border-b border-white/5 cursor-pointer transition-colors ${
                      active ? 'bg-accent-cyan/10' : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <td className="px-3 py-2.5">
                      <CategoryBadge category={e.category} />
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-slate-300">
                      <div className="text-[11px] text-slate-500">{e.time ? timeAgo(e.time, now) : '—'}</div>
                      <div className="text-[11px]">{e.time ? formatDateTime(e.time) : 'Unknown'}</div>
                    </td>
                    <td className="px-3 py-2.5 min-w-[220px]">
                      <p className="text-slate-200 leading-snug line-clamp-2">{e.title}</p>
                      {e.description && (
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{e.description}</p>
                      )}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap tabular-nums text-slate-200">
                      {e.magnitude != null ? (
                        <span className="font-semibold">
                          {fmtNum(e.magnitude, e.source === 'usgs' ? 1 : 0)}
                          <span className="text-[10px] text-slate-500 ml-1">{e.magnitudeUnit ?? ''}</span>
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                      {e.depth != null && (
                        <div className="text-[10px] text-slate-500">{fmtNum(e.depth, 1)} km deep</div>
                      )}
                      {e.confidence != null && (
                        <div className="text-[10px] text-slate-500">{e.confidence}% conf</div>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      {e.url ? (
                        <a
                          href={e.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          onClick={(ev) => ev.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[11px] text-accent-cyan hover:text-accent-cyan/80"
                          aria-label={`Open ${e.title} source`}
                        >
                          {e.source.toUpperCase()} <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-500">{e.source.toUpperCase()}</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {events.length > pageSize && (
        <div className="flex items-center justify-between px-3 py-2.5 border-t border-white/5 text-xs text-slate-400">
          <span>
            Showing {current * pageSize + 1}–{Math.min((current + 1) * pageSize, events.length)} of{' '}
            {events.length.toLocaleString()}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={current === 0}
              className="btn btn-ghost px-2.5 py-1 disabled:opacity-40"
            >
              Prev
            </button>
            <span className="tabular-nums">
              {current + 1} / {pageCount}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={current >= pageCount - 1}
              className="btn btn-ghost px-2.5 py-1 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
});
