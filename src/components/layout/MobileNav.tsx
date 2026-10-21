import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '@/config/nav';
import { BrandMark } from './Sidebar';
import { X, HelpCircle } from 'lucide-react';
import { useLang } from '@/i18n/LanguageContext';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  onOpenHelp: () => void;
}

export function MobileNav({ open, onClose, onOpenHelp }: MobileNavProps) {
  const { t } = useLang();
  if (!open) return null;
  return (
    <div className="lg:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={t('common.openMenu')}>
      <div className="absolute inset-0 bg-space-950/80 backdrop-blur-sm animate-fade-in" onClick={onClose} aria-hidden="true" />
      <div className="absolute left-0 top-0 bottom-0 w-[82vw] max-w-[320px] bg-space-900 border-r border-white/5 flex flex-col animate-slide-in">
        <div className="flex items-center gap-2.5 h-16 px-4 border-b border-white/5">
          <BrandMark />
          <div className="min-w-0">
            <p className="font-bold text-slate-100 leading-none">{t('brand.name')}</p>
            <p className="text-[11px] text-slate-500 mt-1 truncate">{t('brand.tagline')}</p>
          </div>
          <button type="button" onClick={onClose} className="ml-auto btn btn-ghost p-2 min-w-[44px] min-h-[44px]" aria-label={t('common.close')}>
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1" onClick={onClose}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3.5 text-sm transition-colors min-h-[52px] ${
                  isActive
                    ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20'
                    : 'text-slate-300 hover:bg-white/5 border border-transparent'
                }`
              }
            >
              <item.icon size={22} className="shrink-0" />
              <span className="flex-1 min-w-0">
                <span className="block truncate font-medium">{t(item.labelKey)}</span>
                <span className="block truncate text-[11px] text-slate-500">{t(item.descKey)}</span>
              </span>
            </NavLink>
          ))}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenHelp();
            }}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-3.5 text-sm transition-colors min-h-[52px] text-slate-300 hover:bg-white/5 border border-transparent"
          >
            <HelpCircle size={22} className="shrink-0" />
            <span className="font-medium">{t('nav.help')}</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
