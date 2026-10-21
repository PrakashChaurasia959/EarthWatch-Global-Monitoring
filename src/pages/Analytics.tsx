import { useMemo, useState } from 'react';
import { BarChart3, Download, Info } from 'lucide-react';
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
import { useDataStore } from '@/store/DataContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { EventCategoryChart } from '@/components/charts/EventCategoryChart';
import { MagnitudeDistribution } from '@/components/charts/MagnitudeDistribution';
import { EventTrendChart } from '@/components/charts/EventTrendChart';
import { ChartShell, CHART_GRID, CHART_COLORS } from '@/components/charts/ChartShell';
import { eventsByRegion, magnitudeBands, eventsByCategory } from '@/utils/charts';
import { toCsv, downloadCsv } from '@/utils/csv';
import { categoryLabel } from '@/utils/categories';
import { useToast } from '@/components/ui/Toast';
import { useLang } from '@/i18n/LanguageContext';

export default function Analytics() {
  const { allEvents, earthquakes } = useDataStore();
  const { t } = useLang();
  const { toast } = useToast();
  const [days, setDays] = useState(14);

  const regionData = useMemo(() => eventsByRegion(allEvents).sort((a, b) => b.count - a.count), [allEvents]);
  const magData = useMemo(() => magnitudeBands(earthquakes.events), [earthquakes.events]);
  const catData = useMemo(() => eventsByCategory(allEvents), [allEvents]);
  const totalRecords = allEvents.length;

  const exportCsv = () => {
    if (totalRecords === 0) {
      toast(t('an.noExport'), { variant: 'info' });
      return;
    }
    const csv = toCsv(allEvents);
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(`earthwatch-events-${stamp}.csv`, csv);
    toast(t('an.exportedToast', { n: totalRecords.toLocaleString() }), { variant: 'success' });
  };

  const summary = useMemo(() => {
    const withCoords = allEvents.filter((e) => e.longitude != null && e.latitude != null).length;
    const withMag = earthquakes.events.filter((e) => e.magnitude != null).length;
    return { total: totalRecords, withCoords, withMag, categories: catData.length };
  }, [allEvents, earthquakes.events, totalRecords, catData.length]);

  const periodOptions = [
    { value: 7, label: t('an.last7') },
    { value: 14, label: t('an.last14') },
    { value: 30, label: t('an.last30') },
  ];

  const stats = [
    { label: t('an.recordsLoaded'), value: summary.total },
    { label: t('an.withCoords'), value: summary.withCoords },
    { label: t('an.withMag'), value: summary.withMag },
    { label: t('an.categories'), value: summary.categories },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in">
      <PageHeader
        icon={<BarChart3 size={18} />}
        title={t('an.title')}
        subtitle={t('an.subtitle')}
        action={
          <Button onClick={exportCsv} variant="primary" icon={<Download size={15} />}>
            {t('an.export')}
          </Button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Card key={s.label} className="p-3">
            <p className="text-2xl font-bold text-slate-100 tabular-nums">{s.value.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Select label={t('an.trendPeriod')} value={days} onChange={(v) => setDays(v as number)} options={periodOptions} className="w-44" />
        <p className="text-[11px] text-slate-500 flex items-center gap-1.5 sm:mt-5">
          <Info size={12} /> {t('an.trendNote')}
        </p>
      </div>

      <EventTrendChart events={allEvents} days={days} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <MagnitudeDistribution events={earthquakes.events} />
        <EventCategoryChart events={allEvents} />
      </div>

      <ChartShell
        title={t('an.magBandsTitle')}
        subtitle={t('an.magBandsSub')}
        isEmpty={magData.every((d) => d.count === 0)}
        emptyTitle={t('an.noQuake')}
        emptyDescription={t('an.noQuakeDesc')}
        height={220}
      >
        <ResponsiveContainer>
          <BarChart data={magData} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid stroke={CHART_GRID} horizontal={false} />
            <XAxis type="number" allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={{ stroke: CHART_GRID }} tickLine={false} />
            <YAxis type="category" dataKey="label" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: CHART_GRID }} tickLine={false} width={64} />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              contentStyle={{ background: 'rgba(13,18,32,0.96)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#e2e8f0', fontSize: 12 }}
              formatter={(v: number) => [`${v} ${t('chart.eventsLabel')}`, '']}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={28}>
              {magData.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartShell>

      <ChartShell
        title={t('an.regionTitle')}
        subtitle={t('an.regionSub')}
        isEmpty={regionData.length === 0}
        emptyTitle={t('an.noGeo')}
        emptyDescription={t('an.noGeoDesc')}
        height={Math.max(200, regionData.length * 36)}
      >
        <ResponsiveContainer>
          <BarChart data={regionData} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid stroke={CHART_GRID} horizontal={false} />
            <XAxis type="number" allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={{ stroke: CHART_GRID }} tickLine={false} />
            <YAxis type="category" dataKey="region" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: CHART_GRID }} tickLine={false} width={100} />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              contentStyle={{ background: 'rgba(13,18,32,0.96)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#e2e8f0', fontSize: 12 }}
              formatter={(v: number) => [`${v} ${t('chart.eventsLabel')}`, '']}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={28}>
              {regionData.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartShell>

      <Card>
        <h3 className="text-sm font-semibold text-slate-100 mb-2">{t('an.catBreakdown')}</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
          {catData.map((c) => (
            <li key={c.category} className="flex items-center justify-between gap-2 py-1 border-b border-white/5">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: c.color }} />
                {categoryLabel(c.category as never)}
              </span>
              <span className="tabular-nums text-slate-400">{c.value.toLocaleString()}</span>
            </li>
          ))}
          {catData.length === 0 && <li className="text-slate-500">{t('an.noCats')}</li>}
        </ul>
      </Card>

      <p className="text-[11px] text-slate-500">{t('an.exportFooter', { n: totalRecords.toLocaleString() })}</p>
    </div>
  );
}
