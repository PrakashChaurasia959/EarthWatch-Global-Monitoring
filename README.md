# EarthWatch — Global Earth Monitoring Platform

> **Monitor Our Planet. Understand Our Earth.**

EarthWatch is a premium, dark-themed global Earth monitoring dashboard that brings
together public earthquake, wildfire, natural-event, and satellite data from
NASA and the USGS into a single, accessible interface. Every number you see is
computed from a real API response — there is **no fabricated, simulated, or
randomized live data** anywhere in the application.

---

## Table of contents

1. [Features](#features)
2. [Tech stack](#tech-stack)
3. [Screenshots](#screenshots)
4. [Architecture](#architecture)
5. [Folder structure](#folder-structure)
6. [Local installation](#local-installation)
7. [Environment variable setup](#environment-variable-setup)
8. [Development commands](#development-commands)
9. [Data sources & attribution](#data-sources--attribution)
10. [API limitations](#api-limitations)
11. [Testing instructions](#testing-instructions)
12. [Production build](#production-build)
13. [Vercel deployment guide](#vercel-deployment-guide)
14. [Known limitations](#known-limitations)
15. [License considerations](#license-considerations)

---

## Features

- **Dashboard** — summary cards, a global event map with layer toggles, charts
  (magnitude distribution, event categories, trends), a monitoring-status panel,
  and a sortable recent-events table with global search.
- **Earthquakes** — live USGS data with time windows (past hour / 24h / 7 days /
  30 days), minimum-magnitude filters, a magnitude legend, map markers sized by
  magnitude, and a detail panel.
- **Wildfires** — NASA FIRMS active-fire detections (when configured) combined
  with public NASA EONET wildfire events as a real-data fallback, plus an optional
  MODIS true-color satellite imagery overlay for smoke context.
- **Natural Events** — NASA EONET v3 across 13 categories (severe storms,
  volcanoes, floods, landslides, drought, dust & haze, sea/lake ice, snow,
  temperature extremes, water color, manmade, wildfires), with open/closed/all
  filters and multi-geometry handling.
- **Satellite & Earth Observation** — daily Earth imagery from NASA GIBS (raster
  WMTS, no key) with a layer selector and date picker, plus NASA APOD
  (Astronomy Picture of the Day) shown separately and clearly labeled as
  astronomy, **not** Earth imagery.
- **Analytics** — trends over time, earthquake magnitude distribution, category
  distribution, approximate regional summaries, and **CSV export** of currently
  loaded records.
- **Reliability** — a common data layer with request timeouts, abort of obsolete
  requests, in-memory caching, de-duplication, manual refresh, last-updated
  timestamps, and stale-cache preservation during failed refreshes. Failed
  requests are shown as "Unavailable" or "Stale" and are never shown as zero events.
- **UX & accessibility** — collapsible sidebar, responsive mobile navigation,
  keyboard shortcut (`/` or `Ctrl/⌘+K`) for global search, debounced filters,
  skeleton loaders, toast notifications, accessible dialogs, reduced-motion
  support, visible keyboard focus, and an accessible map-contents summary.

## Tech stack

| Area | Choice |
|------|--------|
| Framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 (dark, space theme) |
| Routing | React Router 6 (lazy-loaded routes) |
| Map | React Leaflet 4 + Leaflet 1.9 + react-leaflet-cluster |
| Charts | Recharts 2 |
| Icons | Lucide React |
| Testing | Vitest 2 + @testing-library |
| Base tiles | CartoDB Dark Matter + OpenStreetMap attribution |
| Deployment | Static SPA (Vercel-ready) |

No backend is required — all public data is fetched directly from the browser.
Where a credential is needed (NASA FIRMS), a `VITE_`-prefixed variable is used
only because NASA explicitly designed that key for client request URLs (it is a
usage-tracking token, not a server secret). No true secrets are placed in the
browser bundle.

## Screenshots

> Genuine screenshots are intentionally **not** committed (images of live data
> would need updating constantly). To capture your own:

1. Run the dev server: `npm run dev`
2. Open the printed local URL in a browser.
3. Visit each route (`/`, `/earthquakes`, `/wildfires`, `/natural-events`,
   `/satellite`, `/analytics`, `/about`).
4. Capture with your OS screenshot tool and save into `public/images/` (create it
   if needed), e.g. `dashboard.png`, `earthquakes.png`.
5. Reference them here, e.g. `![Dashboard](public/images/dashboard.png)`.

## Architecture

```
Browser (Vite SPA)
  └── App (React Router, lazy routes)
      ├── DataProvider  ── shared context: earthquakes + EONET + FIRMS
      ├── layout        ── sidebar, top bar, mobile nav, global search
      └── pages
          ├── services/  ── one module per data source (usgs, eonet, firms, nasa, gibs)
          │   └── http.ts ── timeout, abort, cache, de-dup, error mapping
          ├── hooks/      ── useAsyncData (lifecycle) + per-source hooks
          ├── components/ ── maps, charts, events, satellite, ui primitives
          ├── utils/      ── date, geo, csv, filters, categories, charts (pure, tested)
          └── types/      ── typed models normalized from raw API responses
```

All upstream responses are validated and normalized into a single
`NormalizedEvent` model, so the map, table, charts, and search treat
earthquakes, EONET events, and fire detections uniformly.

## Folder structure

```
EarthWatch-Global-Monitoring/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/      AppLayout, Sidebar, TopBar, MobileNav, PageHeader
│   │   ├── dashboard/   SummaryCards, MonitoringStatus, GlobalSearch
│   │   ├── maps/        WorldMap, EventMarkers, GibsOverlay, markerIcons
│   │   ├── charts/      MagnitudeDistribution, EventCategoryChart, EventTrendChart
│   │   ├── events/      EventFilters, EventTable, EventDetailPanel, EventExplorer
│   │   ├── satellite/   ApodGallery, GibsExplorer
│   │   └── ui/          Card, Badge, Button, Modal, Toast, Skeleton, Select, …
│   ├── pages/           Dashboard, Earthquakes, Wildfires, NaturalEvents,
│   │                    SatelliteExplorer, Analytics, About, NotFound
│   ├── services/        http, usgs, eonet, firms, nasa, gibs
│   ├── hooks/           useAsyncData, useEarthquakes, useEonetEvents,
│   │                    useFirms, useApod, useNow, useDebounce
│   ├── store/           DataContext (shared data provider)
│   ├── types/           common, earthquake, eonet, firms, nasa
│   ├── utils/           date, geo, csv, filters, categories, charts, format
│   ├── config/          env, nav
│   ├── App.tsx, main.tsx, index.css, vite-env.d.ts
├── tests/               date, geo, usgs, eonet, firms, nasa, http, csv,
│                        filters, charts, gibs (+ setup.ts)
├── .env.example, .gitignore
├── index.html, package.json, tsconfig*.json
├── vite.config.ts, tailwind.config.js, postcss.config.js
├── vercel.json, README.md
```

## Local installation

Requires Node.js 18+ (built and tested on Node 20+/26).

```bash
git clone <your-repo-url> EarthWatch-Global-Monitoring
cd EarthWatch-Global-Monitoring
npm install
```

If `npm install` warns about a pending install script for `esbuild` (used by
Vite), approve it once:

```bash
npm approve-scripts esbuild
```

## Environment variable setup

Copy the example file and edit only the variables you need:

```bash
cp .env.example .env   # or: copy .env.example .env  (Windows)
```

| Variable | Required? | Description |
|----------|-----------|-------------|
| `VITE_NASA_API_KEY` | Optional | NASA API key for APOD. Defaults to `DEMO_KEY` (rate-limited). Get a free key at https://api.nasa.gov/. |
| `VITE_FIRMS_MAP_KEY` | Optional | NASA FIRMS MAP_KEY for active-fire detections. Register at https://firms.modaps.eosdis.nasa.gov/api/map_key/. |
| `VITE_DEFAULT_QUAKE_WINDOW` | Optional | `hour` / `day` / `week` / `month`. Default `day`. |
| `VITE_DEFAULT_FIRMS_SOURCE` | Optional | `VIIRS_SNPP` / `VIIRS_NOAA20` / `MODIS` / `combined`. Default `VIIRS_SNPP`. |

**Security notes**

- Only `VITE_`-prefixed variables are exposed to the browser bundle.
- Never place true secrets behind a `VITE_` variable.
- The FIRMS MAP_KEY is a usage-tracking token explicitly meant for client request
  URLs — it is safe to expose and is **not** a server credential.
- `.env` is gitignored and will never be committed.

When `VITE_FIRMS_MAP_KEY` is absent, the Wildfires page still works using public
EONET wildfire events and shows a setup notice for FIRMS. When the NASA key is
absent, APOD falls back to `DEMO_KEY`.

## Development commands

```bash
npm run dev        # start Vite dev server (prints local URL, e.g. http://localhost:5173)
npm run typecheck   # tsc --noEmit
npm run test        # run the Vitest suite once
npm run test:watch  # interactive test watch mode
npm run build       # typecheck + production build to dist/
npm run preview     # serve the production build locally
```

## Data sources & attribution

- **USGS Earthquake API** — https://earthquake.usgs.gov/fdsnws/event/1/ (no key).
- **NASA EONET v3** — https://eonet.gsfc.nasa.gov/api/v3/ (no key).
- **NASA FIRMS** — https://firms.modaps.eosdis.nasa.gov/ (free MAP_KEY).
- **NASA GIBS** — https://nasa-gibs.github.io/gibs-api-docs/ (public WMTS, no key).
- **NASA APOD** — https://api.nasa.gov/ (key or DEMO_KEY).
- **Basemap** — CartoDB Dark Matter / © OpenStreetMap contributors.

Attribution is displayed in map controls and the About page. EarthWatch is not
affiliated with NASA or USGS.

## API limitations

- **USGS**: prebuilt summary feeds are reliable; FDSN custom queries are capped at
  20,000 events.
- **EONET**: aggregates many sources and may lag real-time activity; it is not an
  official emergency-warning service and does not capture every disaster.
- **FIRMS**: requires a free MAP_KEY and is rate-limited per key; detections are
  point observations (latitude/longitude of a fire pixel).
- **APOD**: the shared `DEMO_KEY` is limited to ~30 requests/hour/IP and ~50/day;
  rate limits can cause HTTP 429, surfaced as a friendly error.
- **GIBS**: daily layers typically become available within a few hours of capture;
  some dates have no data (the app caps requests to yesterday to avoid partial
  days and uses `maxNativeZoom` so deeper zooms upscale rather than error).
- Browser CORS and provider rate limits may cause transient errors; these appear
  as "Stale" or "Unavailable" in the monitoring-status panel.

## Testing instructions

The test suite covers API response parsing, date formatting, earthquake and
category filters, chart data transforms, missing-coordinate handling, error
states, search behavior, and CSV export.

```bash
npm run test        # all 60 tests
npm run typecheck   # strict TypeScript
npm run build       # typecheck + production build
```

Tests are pure-unit where possible (no network) so they run quickly and
deterministically. To add a browser/integration test layer, Vitest's jsdom
environment is already configured in `vite.config.ts`.

## Production build

```bash
npm run build       # outputs to dist/
npm run preview     # verify the build locally
```

The build typechecks, bundles (with manual chunks for react/map/charts), and
outputs a static SPA in `dist/`.

## Vercel deployment guide

The repository is Vercel-ready. `vercel.json` sets the framework, build command,
output directory (`dist`), and a catch-all rewrite so deep links such as
`/earthquakes` and `/analytics` resolve to the SPA instead of 404.

1. Push the repository to GitHub (see below if no remote exists).
2. In Vercel, **Import Project** and select the repo.
3. Framework preset is detected as **Vite** (or set in `vercel.json`).
4. Build command: `npm run build` · Output directory: `dist`.
5. Add environment variables under **Project → Settings → Environment Variables**:
   - `VITE_NASA_API_KEY` (optional — your key, or leave unset for DEMO_KEY)
   - `VITE_FIRMS_MAP_KEY` (optional)
6. Deploy. Vercel redeploys automatically on subsequent pushes to the default branch.
7. Verify a hard refresh on `/earthquakes`, `/analytics`, etc. does not 404.

To redeploy after a GitHub push: Vercel auto-deploys on push to the connected
branch, or use `vercel --prod` from the CLI, or the Vercel dashboard **Redeploy**.

> The frontend is a static SPA; no server runtime is required on Vercel. If you
> later add a Python backend (not required for this app), deploy it separately on
> a free-tier service that runs persistent processes (e.g. Render, Railway, Fly)
> and point the frontend at its URL — Vercel does not run persistent Python
> servers.

## Known limitations

- Trend charts only span the history of the loaded feeds (the default USGS day
  feed ≈ 24h, so a 30-day trend is sparse). Historical analysis beyond loaded
  records is never invented.
- The map caps the number of rendered markers for performance on very large
  feeds.
- Some EONET events have no usable coordinates and appear only in the table,
  not on the map.
- GIBS thermal-anomaly layers are now vector tiles and are intentionally not
  used as raster overlays; a brightness-temperature raster layer is offered
  instead for thermal context.
- EONET and FIRMS are not official emergency-warning services.
- Regional summaries use approximate continent bounding boxes, not precise
  country geometries.

## License considerations

- **Code**: MIT-style permissive use is assumed for the application code in this
  repository (set an explicit LICENSE file if your organization requires one).
- **Data**: all data remain the property of their providers (USGS, NASA, and
  partners). Respect each provider's attribution and usage policies linked in
  the About page.
- **Basemap tiles**: CartoDB/OSM tiles are used under their public usage policy;
  heavy production traffic may require your own tile server.
- No third-party data is bundled or redistributed; it is fetched at runtime from
  the public endpoints above.
```
