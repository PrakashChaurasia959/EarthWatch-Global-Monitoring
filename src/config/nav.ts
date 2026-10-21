import type { LucideIcon } from 'lucide-react';
import {
  Home,
  Globe2,
  Waves,
  Flame,
  Tornado,
  Droplets,
  Satellite,
  BarChart3,
} from 'lucide-react';
import type { StringKey } from '@/i18n/translations';

export interface NavItem {
  to: string;
  /** i18n key for the label. */
  labelKey: StringKey;
  /** i18n key for the short description. */
  descKey: StringKey;
  icon: LucideIcon;
  /** Whether to match the route exactly (for the index route). */
  end?: boolean;
}

/** Primary navigation — every entry maps to a real implemented page. */
export const NAV_ITEMS: NavItem[] = [
  { to: '/', labelKey: 'nav.home', descKey: 'nav.description.home', icon: Home, end: true },
  { to: '/map', labelKey: 'nav.map', descKey: 'nav.description.map', icon: Globe2 },
  { to: '/earthquakes', labelKey: 'nav.earthquakes', descKey: 'nav.description.earthquakes', icon: Waves },
  { to: '/wildfires', labelKey: 'nav.wildfires', descKey: 'nav.description.wildfires', icon: Flame },
  { to: '/natural-events?category=severeStorms', labelKey: 'nav.storms', descKey: 'nav.description.storms', icon: Tornado },
  { to: '/natural-events?category=floods', labelKey: 'nav.floods', descKey: 'nav.description.floods', icon: Droplets },
  { to: '/satellite', labelKey: 'nav.satellite', descKey: 'nav.description.satellite', icon: Satellite },
  { to: '/analytics', labelKey: 'nav.analytics', descKey: 'nav.description.analytics', icon: BarChart3 },
];
