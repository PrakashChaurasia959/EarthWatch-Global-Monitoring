import { NavLink } from 'react-router-dom';
import { ChevronLeft, Globe2, HelpCircle } from 'lucide-react';
import { NAV_ITEMS } from '@/config/nav';
import { useLang } from '@/i18n/LanguageContext';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onOpenHelp: () => void;
}

export function Sidebar({ collapsed, onToggle, onOpenHelp }: SidebarProps) {
  const { t } = useLang();
  return (
    <aside
      className={`hidden lg:flex flex-col shrink-0 border-r border-white/5 bg-space-900/60 backdrop-blur-xl transition-[width] duration-200 ${
        collapsed ? 'w-[76px]' : 'w-[260px]'
      }`}
      aria-label="Primary navigation"
    >
      <div className="flex items-center gap-2.5 h-16 px-4 border-b border-white/5">
        <BrandMark />
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-bold text-slate-100 leading-none tracking-tight">{t('brand.name')}</p>
            <p className="text-[11px] text-slate-500 truncate mt-1">{t('brand.tagline')}</p>
          </div>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="ml-auto btn btn-ghost -mr-2 p-2 min-w-[44px] min-h-[44px]"
          aria-label={collapsed ? t('common.expandSidebar') : t('common.collapseSidebar')}
          aria-expanded={!collapsed}
        >
          <ChevronLeft size={20} className={`transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto no-scrollbar py-3 px-2 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors min-h-[48px] ${
                isActive
                  ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
              }`
            }
            title={collapsed ? t(item.labelKey) : undefined}
          >
            <item.icon size={22} className="shrink-0" />
            {!collapsed && (
              <span className="flex-1 min-w-0">
                <span className="block truncate font-medium">{t(item.labelKey)}</span>
                <span className="block truncate text-[11px] text-slate-500">{t(item.descKey)}</span>
              </span>
            )}
          </NavLink>
        ))}
        <button
          type="button"
          onClick={onOpenHelp}
          className={`w-full group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors min-h-[48px] text-slate-300 hover:bg-white/5 hover:text-white border border-transparent ${
            collapsed ? 'justify-center' : ''
          }`}
          title={collapsed ? t('nav.help') : undefined}
        >
          <HelpCircle size={22} className="shrink-0" />
          {!collapsed && <span className="font-medium">{t('nav.help')}</span>}
        </button>
      </nav>

      <div className="px-3 py-3 border-t border-white/5">
        {!collapsed && (
          <p className="text-[11px] text-slate-600 leading-relaxed">
            सार्वजनिक डेटा · USGS · NASA EONET · NASA FIRMS · NASA GIBS
          </p>
        )}
      </div>
    </aside>
  );
}

export function BrandMark() {
  return (
    <span className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-teal/10 border border-accent-cyan/20 shadow-glow shrink-0">
      <Globe2 size={22} className="text-accent-cyan" />
      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent-green animate-pulse-soft" aria-hidden="true" />
    </span>
  );
}
