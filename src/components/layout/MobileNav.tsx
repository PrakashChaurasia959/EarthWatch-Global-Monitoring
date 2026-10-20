import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '@/config/nav';
import { BrandMark } from './Sidebar';
import { X } from 'lucide-react';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  if (!open) return null;
  return (
    <div className="lg:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Navigation menu">
      <div className="absolute inset-0 bg-space-950/80 backdrop-blur-sm animate-fade-in" onClick={onClose} aria-hidden="true" />
      <div className="absolute left-0 top-0 bottom-0 w-[78vw] max-w-[300px] bg-space-900 border-r border-white/5 flex flex-col animate-slide-in">
        <div className="flex items-center gap-2.5 h-16 px-4 border-b border-white/5">
          <BrandMark />
          <div className="min-w-0">
            <p className="font-bold text-slate-100 leading-none">EarthWatch</p>
            <p className="text-[11px] text-slate-500 mt-1">Monitor Our Planet</p>
          </div>
          <button type="button" onClick={onClose} className="ml-auto btn btn-ghost p-1.5" aria-label="Close menu">
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1" onClick={onClose}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${
                  isActive
                    ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20'
                    : 'text-slate-300 hover:bg-white/5 border border-transparent'
                }`
              }
            >
              <item.icon size={18} className="shrink-0" />
              <span className="flex-1 min-w-0">
                <span className="block truncate font-medium">{item.label}</span>
                <span className="block truncate text-[11px] text-slate-500">{item.description}</span>
              </span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
