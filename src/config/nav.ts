import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Waves,
  Flame,
  CloudLightning,
  Satellite,
  BarChart3,
  Info,
} from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

/** Primary navigation — every entry maps to a real implemented page. */
export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, description: 'Global overview' },
  { to: '/earthquakes', label: 'Earthquakes', icon: Waves, description: 'USGS seismic data' },
  { to: '/wildfires', label: 'Wildfires', icon: Flame, description: 'FIRMS & EONET fires' },
  { to: '/natural-events', label: 'Natural Events', icon: CloudLightning, description: 'NASA EONET feed' },
  { to: '/satellite', label: 'Satellite', icon: Satellite, description: 'GIBS & APOD' },
  { to: '/analytics', label: 'Analytics', icon: BarChart3, description: 'Trends & export' },
  { to: '/about', label: 'About', icon: Info, description: 'Sources & limitations' },
];
