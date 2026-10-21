import { useMemo, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Satellite, CalendarDays, Info, ExternalLink } from 'lucide-react';
import { GIBS_LAYERS, gibsTileTemplate, GIBS_ATTRIBUTION, GIBS_EARLIEST } from '@/services/gibs';
import { Card, CardHeader } from '@/components/ui/Card';
import { Select, Field } from '@/components/ui/Select';
import { toIsoDate } from '@/utils/date';
import { useLang } from '@/i18n/LanguageContext';
import type { GibsLayer } from '@/types/nasa';

const BASE_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
const BASE_ATTR = '&copy; OpenStreetMap contributors &copy; CARTO';

export function GibsExplorer() {
  const { t } = useLang();
  const [layerId, setLayerId] = useState<string>(GIBS_LAYERS[0].id);
  const layer = useMemo<GibsLayer>(() => GIBS_LAYERS.find((l) => l.id === layerId) ?? GIBS_LAYERS[0], [layerId]);

  const today = toIsoDate(Date.now() - 86_400_000); // yesterday (today may be incomplete)
  const [date, setDate] = useState<string>(layer.defaultDate ?? today);

  const maxDate = toIsoDate(Date.now() - 86_400_000);
  const overlayUrl = useMemo(() => gibsTileTemplate(layer, date), [layer, date]);

  const onLayerChange = (id: string) => {
    const next = GIBS_LAYERS.find((l) => l.id === id);
    setLayerId(id);
    if (next?.defaultDate) setDate(next.defaultDate);
  };

  return (
    <Card>
      <CardHeader title={t('sat.gibsTitle')} subtitle={t('sat.gibsSubtitle')} icon={<Satellite size={16} />} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 space-y-3">
          <Select
            id="gibs-layer"
            label={t('sat.gibsLayer')}
            value={layerId}
            onChange={onLayerChange}
            options={GIBS_LAYERS.map((l) => ({ value: l.id, label: l.title }))}
          />
          <Field label={t('sat.gibsDate')}>
            <div className="relative">
              <CalendarDays size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type="date"
                min={GIBS_EARLIEST}
                max={maxDate}
                value={date}
                onChange={(e) => setDate(e.target.value || maxDate)}
                className="input pl-9 min-h-[44px]"
                aria-label={t('sat.gibsDate')}
              />
            </div>
          </Field>

          <div className="rounded-xl border border-white/5 bg-space-900/40 p-3">
            <p className="text-sm font-semibold text-slate-100">{layer.title}</p>
            <p className="text-xs text-slate-400 mt-1">{layer.subtitle}</p>
            <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
              <Info size={12} /> {t('sat.gibsInfo')}
            </p>
          </div>

          <a
            href={`https://worldview.earthdata.nasa.gov/?l=${encodeURIComponent(layer.id)}`}
            target="_blank"
            rel="noreferrer noopener"
            className="btn btn-outline w-full min-h-[44px]"
          >
            <ExternalLink size={15} /> {t('sat.gibsWorldview')}
          </a>
        </div>

        <div className="lg:col-span-3">
          <div className="h-[420px] sm:h-[500px] rounded-2xl overflow-hidden border border-white/10 bg-[#e8eef4] relative">
            <MapContainer center={[20, 0]} zoom={2} minZoom={1} maxZoom={12} className="w-full h-full" scrollWheelZoom attributionControl>
              <TileLayer url={BASE_URL} attribution={BASE_ATTR} subdomains="abcd" maxZoom={19} detectRetina />
              <TileLayer
                key={`${layer.id}-${date}`}
                url={overlayUrl}
                attribution={GIBS_ATTRIBUTION}
                opacity={0.92}
                maxNativeZoom={layer.maxLevel}
                maxZoom={12}
                tileSize={256}
              />
            </MapContainer>
            <div className="absolute bottom-2 left-2 ew-glass-dark rounded-lg px-2 py-1 text-[10px] text-slate-100 pointer-events-none">
              {layer.title} · {date} UTC
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
