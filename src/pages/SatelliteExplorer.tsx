import { Satellite } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ApodGallery } from '@/components/satellite/ApodGallery';
import { GibsExplorer } from '@/components/satellite/GibsExplorer';
import { Card } from '@/components/ui/Card';
import { USING_DEMO_KEY } from '@/config/env';

export default function SatelliteExplorer() {
  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in">
      <PageHeader
        icon={<Satellite size={18} />}
        title="Satellite & Earth Observation"
        subtitle="Public NASA imagery — daily Earth observation (GIBS) and the Astronomy Picture of the Day (APOD)"
      />

      <GibsExplorer />

      <ApodGallery />

      <Card>
        <h3 className="text-sm font-semibold text-slate-100 mb-2">About these resources</h3>
        <ul className="space-y-1.5 text-xs text-slate-400 list-disc list-inside">
          <li>
            <b>NASA GIBS</b> (Global Imagery Browse Services) provides full-globe, daily satellite imagery from
            MODIS and VIIRS. It is fully public and requires no API key. We use the EPSG:3857 WMTS endpoint.
          </li>
          <li>
            <b>NASA APOD</b> (Astronomy Picture of the Day) shows astronomy imagery — galaxies, nebulae, the Sun,
            and more. It is shown here separately and is intentionally not presented as satellite imagery of Earth.
          </li>
          <li>
            APOD uses the NASA API key configured as <code className="text-accent-cyan">VITE_NASA_API_KEY</code>.
            {USING_DEMO_KEY
              ? ' Currently using the shared DEMO_KEY, which is rate-limited (≈30 requests/hour/IP). Get a free key at api.nasa.gov for higher limits.'
              : ' A real API key is configured.'}
          </li>
          <li>Imagery © NASA GIBS / NASA APOD. Each image links back to its original source.</li>
        </ul>
      </Card>
    </div>
  );
}
