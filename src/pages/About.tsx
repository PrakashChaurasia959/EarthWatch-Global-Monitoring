import { Link } from 'react-router-dom';
import { Info, ExternalLink, Github, KeyRound, Database, TriangleAlert } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { USING_DEMO_KEY, FIRMS_CONFIGURED, ENV_SUMMARY } from '@/config/env';

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
  { name: 'CartoDB / OpenStreetMap', url: 'https://carto.com/basemaps/', desc: 'Dark basemap tiles for the interactive map.' },
];

export default function About() {
  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in max-w-4xl mx-auto">
      <PageHeader
        icon={<Info size={18} />}
        title="About EarthWatch"
        subtitle="Monitor Our Planet. Understand Our Earth."
      />

      <Section title="Overview">
        <p>
          EarthWatch is an open, agency-data-driven global monitoring dashboard. It brings together public
          earthquake, wildfire, natural-event, and satellite data into a single, accessible interface. Every
          number you see is computed from a real API response — there is no fabricated, simulated, or randomized
          live data anywhere in the app.
        </p>
        <p className="text-slate-400">
          EarthWatch is not an official emergency-warning system and is not affiliated with NASA or USGS. Treat
          it as an exploration and situational-awareness tool, not an authoritative source for emergency response.
        </p>
      </Section>

      <Section title="Features">
        <ul className="list-disc list-inside space-y-1 text-slate-300">
          <li>Global overview dashboard with summary cards, live map, and charts</li>
          <li>Earthquake monitoring from USGS with magnitude filters and time windows</li>
          <li>Wildfire monitoring from NASA FIRMS, with NASA EONET wildfire events as a public fallback</li>
          <li>Natural events from NASA EONET across 13 categories</li>
          <li>Satellite & Earth observation explorer using NASA GIBS imagery and NASA APOD</li>
          <li>Analytics with trends, distributions, regional summaries, and CSV export</li>
          <li>Global search, debounced filters, layer toggles, and an accessible event list</li>
          <li>Connection/freshness indicators that distinguish failed requests from zero results</li>
        </ul>
      </Section>

      <Section title="Data sources & attribution">
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

      <Section title="API limitations">
        <ul className="list-disc list-inside space-y-1 text-slate-400">
          <li><b>USGS</b>: prebuilt feeds are reliable; the FDSN query supports custom ranges with a max of 20,000 events.</li>
          <li><b>EONET</b>: aggregates many sources and may lag real-time activity; not every disaster is captured.</li>
          <li><b>FIRMS</b>: requires a free MAP_KEY and is rate-limited per key; fire detections are point observations.</li>
          <li><b>APOD</b>: the shared DEMO_KEY is limited to ~30 requests/hour/IP and ~50/day; rate limits can cause 429s.</li>
          <li><b>GIBS</b>: daily layers become available within a few hours of capture; some dates have no data.</li>
          <li>Browser CORS and provider rate limits may cause transient errors, shown as “Stale” or “Unavailable”.</li>
        </ul>
      </Section>

      <Section title="Environment configuration">
        <div className="flex items-start gap-2">
          <KeyRound size={16} className="text-accent-amber mt-0.5 shrink-0" />
          <p className="text-slate-300">
            Current status — NASA API key: <code className="text-accent-cyan">{ENV_SUMMARY.nasaKey}</code>;
            FIRMS MAP_KEY: <code className="text-accent-cyan">{ENV_SUMMARY.firmsKey}</code>.
          </p>
        </div>
        <p>
          Copy <code className="text-accent-cyan">.env.example</code> to <code className="text-accent-cyan">.env</code> and set
          only the <code>VITE_</code>-prefixed values you need. Never place true secrets behind a <code>VITE_</code> variable —
          the FIRMS MAP_KEY is a usage-tracking token explicitly meant for client URLs, not a server secret. See the README
          for full setup instructions.
        </p>
        {USING_DEMO_KEY && (
          <p className="text-slate-400">
            APOD is currently using DEMO_KEY. For reliable use, register a free key at{' '}
            <a className="text-accent-cyan" href="https://api.nasa.gov/" target="_blank" rel="noreferrer noopener">api.nasa.gov</a>.
          </p>
        )}
        {!FIRMS_CONFIGURED && (
          <p className="text-slate-400">
            FIRMS is not configured. Get a free MAP_KEY at{' '}
            <a className="text-accent-cyan" href="https://firms.modaps.eosdis.nasa.gov/api/map_key/" target="_blank" rel="noreferrer noopener">firms.modaps.eosdis.nasa.gov/api/map_key/</a>.
          </p>
        )}
      </Section>

      <Section title="Known limitations">
        <div className="flex items-start gap-2">
          <TriangleAlert size={16} className="text-accent-amber mt-0.5 shrink-0" />
          <p>
            Trend charts only span the history of the loaded feeds (e.g. the default USGS day feed ≈ 24h, so a 30-day
            trend will be sparse). Historical analysis beyond loaded records is not invented. The map caps the number
            of rendered markers for performance. Some EONET events have no usable coordinates and appear only in the
            table, not on the map.
          </p>
        </div>
      </Section>

      <Section title="Open source">
        <div className="flex items-start gap-2">
          <Github size={16} className="text-accent-cyan mt-0.5 shrink-0" />
          <p>
            Built with React, TypeScript, Vite, Tailwind CSS, React Leaflet, Recharts, and Lucide. See the README
            for local setup, testing, build, and Vercel deployment instructions. The project uses only public data
            and free-tier services. License considerations for data and software are documented in the README.
          </p>
        </div>
      </Section>

      <div className="flex justify-center pt-2">
        <Link to="/" className="btn btn-primary">Back to dashboard</Link>
      </div>
    </div>
  );
}
