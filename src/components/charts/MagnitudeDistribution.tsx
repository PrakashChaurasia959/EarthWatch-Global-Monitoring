import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { NormalizedEvent } from '@/types/common';
import { MAGNITUDE_BANDS } from '@/utils/format';
import { ChartShell, CHART_GRID } from './ChartShell';
import { useLang } from '@/i18n/LanguageContext';

interface Props {
  events: NormalizedEvent[];
}

interface BarDatum {
  label: string;
  count: number;
  color: string;
}

/** Compute magnitude band counts from actual earthquake events. */
export function useMagnitudeDistribution(events: NormalizedEvent[]): BarDatum[] {
  return useMemo(() => {
    const quakes = events.filter((e) => e.source === 'usgs' && e.magnitude != null);
    return MAGNITUDE_BANDS.map((band) => ({
      label: band.label,
      count: quakes.filter((e) => e.magnitude != null && e.magnitude >= band.min && e.magnitude < band.max)
        .length,
      color: band.color,
    }));
  }, [events]);
}

export function MagnitudeDistribution({ events }: Props) {
  const data = useMagnitudeDistribution(events);
  const isEmpty = data.every((d) => d.count === 0);
  const { t } = useLang();

  return (
    <ChartShell
      title={t('chart.magDist')}
      subtitle={t('chart.magDistSub')}
      isEmpty={isEmpty}
      emptyTitle={t('chart.noQuake')}
      emptyDescription={t('chart.noQuakeDesc')}
      height={240}
    >
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid stroke={CHART_GRID} vertical={false} />
          <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={{ stroke: CHART_GRID }} />
          <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={{ stroke: CHART_GRID }} />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            contentStyle={{ background: 'rgba(13,18,32,0.96)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#e2e8f0', fontSize: 12 }}
            formatter={(v: number) => [`${v} ${t('chart.eventsLabel')}`, '']}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={64}>
            {data.map((d) => (
              <Cell key={d.label} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}
