import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, RefreshCw, Search, Globe2, HelpCircle } from 'lucide-react';
import { useDataStore } from '@/store/DataContext';
import { useNow } from '@/hooks/useNow';
import { formatDateTime, timeAgo, localTimeZone } from '@/utils/date';
import { Spinner } from '@/components/ui/Skeleton';
import { useLang } from '@/i18n/LanguageContext';

interface TopBarProps {
  onOpenMobileNav: () => void;
  onOpenSearch: () => void;
  onOpenHelp: () => void;
}

const titleFor = (path: string, t: (k: never) => string): string => {
  const map: Record<string, string> = {
    '/': t('nav.home' as never),
    '/map': t('nav.map' as never),
    '/earthquakes': t('nav.earthquakes' as never),
    '/wildfires': t('nav.wildfires' as never),
    '/natural-events': t('events.title' as never),
    '/satellite': t('nav.satellite' as never),
    '/analytics': t('nav.analytics' as never),
    '/about': t('nav.about' as never),
  };
  return map[path] ?? t('brand.name' as never);
};

export function TopBar({ onOpenMobileNav, onOpenSearch, onOpenHelp }: TopBarProps) {
  const { refreshAll, lastUpdated, earthquakes, eonet, fires } = useDataStore();
  const now = useNow(1000);
  const location = useLocation();
  const { t, lang, setLang } = useLang();
  const pageTitle = titleFor(location.pathname, t as never);

  const anyLoading = earthquakes.loading || eonet.loading || fires.loading;

  const tz = localTimeZone();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const onRefresh = () => {
    if (!anyLoading) refreshAll();
  };

  return (
    <header className="sticky top-0 z-40 h-16 px-3 sm:px-5 flex items-center gap-2 border-b border-white/5 bg-space-950/70 backdrop-blur-xl">
      <button
        type="button"
        className="lg:hidden btn btn-ghost p-2 min-w-[44px] min-h-[44px]"
        onClick={onOpenMobileNav}
        aria-label={t('common.openMenu')}
      >
        <Menu size={22} />
      </button>

      <div className="flex items-center gap-2 min-w-0">
        <h1 className="text-sm sm:text-base font-semibold text-slate-100 truncate">{pageTitle}</h1>
        <span className="hidden sm:inline-flex pill bg-white/5 text-slate-400 border border-white/5">
          <Globe2 size={12} /> {t('common.publicData')}
        </span>
      </div>

      {/* Global search trigger */}
      <button
        type="button"
        onClick={onOpenSearch}
        className="hidden md:flex items-center gap-2 ml-2 flex-1 max-w-md rounded-xl bg-space-900/80 border border-white/10 px-3 py-2.5 text-sm text-slate-500 hover:border-white/20 transition-colors text-left min-h-[44px]"
        aria-label={t('common.openSearch')}
      >
        <Search size={16} />
        <span>{t('common.searchPlaceholder')}</span>
        <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">/</kbd>
      </button>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        {/* Language switch */}
        <div className="flex items-center rounded-xl border border-white/10 overflow-hidden" role="group" aria-label={t('common.languageSwitch')}>
          <button
            type="button"
            onClick={() => setLang('hi')}
            className={`px-3 py-2 text-xs font-semibold transition-colors min-h-[40px] ${
              lang === 'hi' ? 'bg-accent-cyan/20 text-accent-cyan' : 'text-slate-400 hover:bg-white/5'
            }`}
            aria-pressed={lang === 'hi'}
          >
            हिं
          </button>
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`px-3 py-2 text-xs font-semibold transition-colors min-h-[40px] ${
              lang === 'en' ? 'bg-accent-cyan/20 text-accent-cyan' : 'text-slate-400 hover:bg-white/5'
            }`}
            aria-pressed={lang === 'en'}
          >
            EN
          </button>
        </div>

        {/* Help */}
        <button
          type="button"
          onClick={onOpenHelp}
          className="btn btn-ghost p-2 min-w-[44px] min-h-[44px]"
          aria-label={t('nav.help')}
          title={t('nav.help')}
        >
          <HelpCircle size={20} />
        </button>

        {/* Connection / freshness (desktop) */}
        <div className="hidden xl:flex flex-col items-end text-right leading-tight">
          <span className="text-[11px] text-slate-500">
            {mounted ? formatDateTime(now, tz) : '—'}
            <span className="text-slate-600"> · {tz}</span>
          </span>
          <span className="text-[11px] text-slate-500">
            {lastUpdated ? `${t('status.updated')} ${timeAgo(lastUpdated, now)}` : t('status.awaiting')}
          </span>
        </div>

        {/* Refresh */}
        <button
          type="button"
          onClick={onRefresh}
          className="btn btn-outline px-3 py-2.5 min-h-[44px]"
          aria-label={t('common.refreshAll')}
          disabled={anyLoading}
          title={t('common.refreshAll')}
        >
          {anyLoading ? <Spinner size={16} /> : <RefreshCw size={18} />}
          <span className="hidden sm:inline">{t('common.refreshAll')}</span>
        </button>
      </div>
    </header>
  );
}
