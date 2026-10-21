import { Link } from 'react-router-dom';
import { Info, ExternalLink, Github, KeyRound, Database, TriangleAlert } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { USING_DEMO_KEY, FIRMS_CONFIGURED, ENV_SUMMARY } from '@/config/env';
import { useLang } from '@/i18n/LanguageContext';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <h2 className="text-base font-semibold text-slate-100 mb-3">{title}</h2>
      <div className="text-sm text-slate-300 space-y-2 leading-relaxed">{children}</div>
    </Card>
  );
}

const SOURCES = [
  { name: 'USGS Earthquake API', url: 'https://earthquake.usgs.gov/fdsnws/event/1/', desc: 'Real-time earthquake feeds and FDSN query. No key required.' },
  { name: 'NASA EONET v3', url: 'https://eonet.gsfc.nasa.gov/api/v3/', desc: 'Natural event categories and records. No key required.' },
  { name: 'NASA FIRMS', url: 'https://firms.modaps.eosdis.nasa.gov/', desc: 'Active fire detections (MODIS/VIIRS). Free MAP_KEY required.' },
  { name: 'NASA GIBS', url: 'https://nasa-gibs.github.io/gibs-api-docs/', desc: 'Daily Earth imagery tiles. Public, no key required.' },
  { name: 'NASA APOD', url: 'https://api.nasa.gov/', desc: 'Astronomy Picture of the Day. API key (DEMO_KEY accepted).' },
  { name: 'CARTO / OpenStreetMap', url: 'https://carto.com/basemaps/', desc: 'Voyager labeled basemap tiles for the interactive map.' },
];

export default function About() {
  const { t } = useLang();
  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in max-w-4xl mx-auto">
      <PageHeader icon={<Info size={18} />} title={t('about.title')} subtitle={t('brand.tagline')} />

      <Section title={t('about.overview')}>
        <p>{t('about.overviewText')}</p>
        <p className="text-slate-400">{t('about.disclaimer')}</p>
      </Section>

      <Section title={t('about.features')}>
        <ul className="list-disc list-inside space-y-1 text-slate-300">
          <li>हिंदी-प्रथम इंटरफ़ेस · Hindi-first UI with language switch</li>
          <li>{t('card.earthquakes')} · {t('card.earthquakesSrc')}</li>
          <li>{t('fire.title')} · NASA FIRMS + NASA EONET</li>
          <li>{t('events.title')} · NASA EONET v3</li>
          <li>{t('sat.title')} · NASA GIBS + APOD</li>
          <li>{t('an.title')} · CSV {t('an.export')}</li>
          <li>{t('worldmap.title')} · CARTO Voyager + country labels</li>
          <li>🔊 {t('common.listen')} (SpeechSynthesis)</li>
        </ul>
      </Section>

      <Section title={t('about.sources')}>
        <ul className="space-y-2">
          {SOURCES.map((s) => (
            <li key={s.name} className="flex items-start gap-2">
              <Database size={14} className="text-accent-cyan mt-0.5 shrink-0" />
              <span>
                <a href={s.url} target="_blank" rel="noreferrer noopener" className="text-accent-cyan hover:text-accent-cyan/80 inline-flex items-center gap-1">
                  {s.name} <ExternalLink size={12} />
                </a>
                <span className="text-slate-400"> — {s.desc}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={t('about.env')}>
        <div className="flex items-start gap-2">
          <KeyRound size={16} className="text-accent-amber mt-0.5 shrink-0" />
          <p className="text-slate-300">
            {t('about.currentStatus', { k: ENV_SUMMARY.nasaKey, f: ENV_SUMMARY.firmsKey })}
          </p>
        </div>
        <p>{t('about.envNote')}</p>
        <p className="text-slate-400">
          CARTO Voyager basemap requires <b>no API key</b> — the earlier broken <code className="text-accent-cyan">VITE_CARTO_API_KEY</code> reference was removed; standard rastertiles work with attribution only.
        </p>
        {USING_DEMO_KEY && (
          <p className="text-slate-400">
            APOD: {t('sat.demonoteFull')}
          </p>
        )}
        {!FIRMS_CONFIGURED && (
          <p className="text-slate-400">
            {t('card.firesNotCfg')}: {t('fire.step1')}
          </p>
        )}
      </Section>

      <Section title={t('about.known')}>
        <div className="flex items-start gap-2">
          <TriangleAlert size={16} className="text-accent-amber mt-0.5 shrink-0" />
          <p className="text-slate-400">{t('monitor.noteFailVsZero')}</p>
        </div>
        <p className="text-slate-400">{t('chart.noTrendDesc')}</p>
        <p className="text-slate-400">{t('events.footer')}</p>
      </Section>

      <Section title={t('about.opensource')}>
        <div className="flex items-start gap-2">
          <Github size={16} className="text-accent-cyan mt-0.5 shrink-0" />
          <p>
            React · TypeScript · Vite · Tailwind · React Leaflet · Recharts · Lucide. See README for setup, testing, build, and Vercel deployment.
          </p>
        </div>
      </Section>

      <div className="flex justify-center pt-2">
        <Link to="/" className="btn btn-primary">{t('about.back')}</Link>
      </div>
    </div>
  );
}
