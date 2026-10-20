import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, RefreshCw, Search, Globe2 } from 'lucide-react';
import { useDataStore } from '@/store/DataContext';
import { useNow } from '@/hooks/useNow';
import { formatDateTime, timeAgo, localTimeZone } from '@/utils/date';
import { Spinner } from '@/components/ui/Skeleton';

interface TopBarProps {
  onOpenMobileNav: () => void;
  onOpenSearch: () => void;
}

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/earthquakes': 'Earthquakes',
  '/wildfires': 'Wildfires',
  '/natural-events': 'Natural Events',
  '/satellite': 'Satellite Explorer',
  '/analytics': 'Analytics',
  '/about': 'About',
};

export function TopBar({ onOpenMobileNav, onOpenSearch }: TopBarProps) {
  const { refreshAll, lastUpdated, earthquakes, eonet, fires } = useDataStore();
  const now = useNow(1000);
  const location = useLocation();
  const pageTitle = titles[location.pathname] ?? 'EarthWatch';

  const anyLoading = earthquakes.loading || eonet.loading || fires.loading;

  const tz = localTimeZone();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const onRefresh = () => {
    if (!anyLoading) refreshAll();
  };

  return (
    <header className="sticky top-0 z-40 h-16 px-3 sm:px-5 flex items-center gap-2 sm:gap-3 border-b border-white/5 bg-space-950/70 backdrop-blur-xl">
      <button
        type="button"
        className="lg:hidden btn btn-ghost p-2"
        onClick={onOpenMobileNav}
        aria-label="Open navigation menu"
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-2 min-w-0">
        <h1 className="text-sm sm:text-base font-semibold text-slate-100 truncate">{pageTitle}</h1>
        <span className="hidden sm:inline-flex pill bg-white/5 text-slate-400 border border-white/5">
          <Globe2 size={12} /> Public data
        </span>
      </div>

      {/* Global search trigger (button styled like an input) */}
      <button
        type="button"
        onClick={onOpenSearch}
        className="hidden md:flex items-center gap-2 ml-2 flex-1 max-w-md rounded-xl bg-space-900/80 border border-white/10 px-3 py-2 text-sm text-slate-500 hover:border-white/20 transition-colors text-left"
        aria-label="Open global search"
      >
        <Search size={16} />
        <span>Search events, places…</span>
        <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">/</kbd>
      </button>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {/* Connection / freshness */}
        <div className="hidden xl:flex flex-col items-end text-right leading-tight">
          <span className="text-[11px] text-slate-500">
            {mounted ? formatDateTime(now, tz) : '—'}
            <span className="text-slate-600"> · {tz}</span>
          </span>
          <span className="text-[11px] text-slate-500">
            {lastUpdated ? `Updated ${timeAgo(lastUpdated, now)}` : 'Awaiting first update'}
          </span>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="btn btn-outline px-2.5 py-2"
          aria-label="Refresh all data sources"
          disabled={anyLoading}
          title="Refresh all data sources"
        >
          {anyLoading ? <Spinner size={16} /> : <RefreshCw size={16} className={anyLoading ? '' : ''} />}
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>
    </header>
  );
}
