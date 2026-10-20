import type { ReactNode } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';

export const CHART_COLORS = ['#22d3ee', '#34d399', '#f59e0b', '#fb7185', '#a78bfa', '#60a5fa', '#f97316', '#2dd4bf', '#ca8a04', '#d6bd6a', '#94a3b8', '#7dd3fc', '#e2e8f0', '#f87171'];

export const CHART_AXIS = { stroke: '#475569', fontSize: 11 };
export const CHART_GRID = '#1c2740';

export function ChartShell({
  title,
  subtitle,
  children,
  isEmpty,
  emptyTitle = 'No data to chart',
  emptyDescription,
  height = 240,
  action,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  height?: number;
  action?: ReactNode;
}) {
  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {isEmpty ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <div style={{ width: '100%', height }}>{children}</div>
      )}
    </div>
  );
}
