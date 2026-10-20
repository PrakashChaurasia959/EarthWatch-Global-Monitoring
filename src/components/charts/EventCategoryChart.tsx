import { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { NormalizedEvent } from '@/types/common';
import { eventsByCategory } from '@/utils/charts';
import { ChartShell } from './ChartShell';

export function EventCategoryChart({ events, title = 'Events by category' }: { events: NormalizedEvent[]; title?: string }) {
  const data = useMemo(() => eventsByCategory(events), [events]);
  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data]);
  const isEmpty = total === 0;

  return (
    <ChartShell
      title={title}
      subtitle={`Distribution of ${total} loaded events`}
      isEmpty={isEmpty}
      emptyTitle="No events loaded"
      emptyDescription="Category counts will appear here once data loads."
      height={240}
    >
      <div className="flex items-center gap-2">
        <div className="flex-1" style={{ height: 220 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius={48}
                outerRadius={86}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((d) => (
                  <Cell key={d.category} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'rgba(13,18,32,0.96)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#e2e8f0', fontSize: 12 }}
                formatter={(v: number, n: string) => [`${v} events`, n]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="w-40 space-y-1.5 text-xs">
          {data.map((d) => (
            <li key={d.category} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: d.color }} />
              <span className="flex-1 truncate text-slate-300">{d.label}</span>
              <span className="text-slate-500 tabular-nums">{d.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </ChartShell>
  );
}
