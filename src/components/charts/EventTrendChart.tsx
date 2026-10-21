import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { NormalizedEvent } from '@/types/common';
import { eventsTrendByDay } from '@/utils/charts';
import { ChartShell, CHART_GRID } from './ChartShell';
import { useLang } from '@/i18n/LanguageContext';

export function EventTrendChart({
  events,
  days = 14,
}: {
  events: NormalizedEvent[];
  days?: number;
  title?: string;
}) {
  const { t } = useLang();
  const data = useMemo(() => eventsTrendByDay(events, days), [events, days]);
  const isEmpty = data.every((d) => d.total === 0);

  return (
    <ChartShell
      title={t('chart.trend')}
      subtitle={t('chart.trendSub', { n: days })}
      isEmpty={isEmpty}
      emptyTitle={t('chart.noTrend')}
      emptyDescription={t('chart.noTrendDesc')}
      height={260}
    >
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gQuake" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gFire" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fb7185" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#fb7185" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gEonet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={CHART_GRID} vertical={false} />
          <XAxis dataKey="bucket" tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={{ stroke: CHART_GRID }} tickFormatter={(v: string) => v.slice(5)} />
          <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={{ stroke: CHART_GRID }} />
          <Tooltip
            contentStyle={{ background: 'rgba(13,18,32,0.96)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#e2e8f0', fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
          <Area type="monotone" dataKey="earthquakes" name="Earthquakes" stroke="#22d3ee" fill="url(#gQuake)" strokeWidth={2} />
          <Area type="monotone" dataKey="fires" name="Fires" stroke="#fb7185" fill="url(#gFire)" strokeWidth={2} />
          <Area type="monotone" dataKey="eonet" name="EONET" stroke="#a78bfa" fill="url(#gEonet)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}
