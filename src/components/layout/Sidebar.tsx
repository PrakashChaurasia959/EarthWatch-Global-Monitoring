import { NavLink } from 'react-router-dom';
import { ChevronLeft, Globe2 } from 'lucide-react';
import { NAV_ITEMS } from '@/config/nav';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={`hidden lg:flex flex-col shrink-0 border-r border-white/5 bg-space-900/60 backdrop-blur-xl transition-[width] duration-200 ${
        collapsed ? 'w-[68px]' : 'w-[248px]'
      }`}
      aria-label="Primary navigation"
    >
      <div className="flex items-center gap-2.5 h-16 px-4 border-b border-white/5">
        <BrandMark />
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-bold text-slate-100 leading-none tracking-tight">EarthWatch</p>
            <p className="text-[11px] text-slate-500 truncate mt-1">Monitor Our Planet</p>
          </div>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="ml-auto btn btn-ghost -mr-2 p-1.5"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
        >
          <ChevronLeft size={18} className={`transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto no-scrollbar py-4 px-2.5 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
              }`
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon size={18} className="shrink-0" />
            {!collapsed && (
              <span className="flex-1 min-w-0">
                <span className="block truncate font-medium">{item.label}</span>
                <span className="block truncate text-[11px] text-slate-500">{item.description}</span>
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-3 border-t border-white/5">
        {!collapsed && (
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Public data · USGS · NASA EONET · NASA FIRMS · NASA GIBS
          </p>
        )}
      </div>
    </aside>
  );
}

export function BrandMark() {
  return (
    <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-teal/10 border border-accent-cyan/20 shadow-glow shrink-0">
      <Globe2 size={20} className="text-accent-cyan" />
      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent-green animate-pulse-soft" aria-hidden="true" />
    </span>
  );
}
