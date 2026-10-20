import type { EventCategory } from '@/types/common';

export interface CategoryMeta {
  id: EventCategory;
  label: string;
  /** Tailwind/hex color used for markers, chips, and charts. */
  color: string;
  glow: string;
  /** Lucide icon name key resolved in components. */
  icon: string;
}

/** Single source of truth for category styling. */
export const CATEGORY_META: Record<EventCategory, CategoryMeta> = {
  earthquake: { id: 'earthquake', label: 'Earthquakes', color: '#22d3ee', glow: 'rgba(34,211,238,0.6)', icon: 'waves' },
  wildfire: { id: 'wildfire', label: 'Wildfires', color: '#fb7185', glow: 'rgba(251,113,133,0.6)', icon: 'flame' },
  volcano: { id: 'volcano', label: 'Volcanoes', color: '#f97316', glow: 'rgba(249,115,22,0.6)', icon: 'mountain' },
  severeStorms: { id: 'severeStorms', label: 'Severe Storms', color: '#a78bfa', glow: 'rgba(167,139,250,0.6)', icon: 'cloud-lightning' },
  flood: { id: 'flood', label: 'Floods', color: '#60a5fa', glow: 'rgba(96,165,250,0.6)', icon: 'droplets' },
  landslide: { id: 'landslide', label: 'Landslides', color: '#d6a04a', glow: 'rgba(214,160,74,0.6)', icon: 'triangle-alert' },
  drought: { id: 'drought', label: 'Drought', color: '#ca8a04', glow: 'rgba(202,138,4,0.6)', icon: 'sun' },
  dustHaze: { id: 'dustHaze', label: 'Dust & Haze', color: '#d6bd6a', glow: 'rgba(214,189,106,0.6)', icon: 'wind' },
  manmade: { id: 'manmade', label: 'Manmade', color: '#94a3b8', glow: 'rgba(148,163,184,0.6)', icon: 'factory' },
  seaLakeIce: { id: 'seaLakeIce', label: 'Sea & Lake Ice', color: '#7dd3fc', glow: 'rgba(125,211,252,0.6)', icon: 'snowflake' },
  snow: { id: 'snow', label: 'Snow', color: '#e2e8f0', glow: 'rgba(226,232,240,0.6)', icon: 'snowflake' },
  tempExtremes: { id: 'tempExtremes', label: 'Temp Extremes', color: '#f87171', glow: 'rgba(248,113,113,0.6)', icon: 'thermometer' },
  waterColor: { id: 'waterColor', label: 'Water Color', color: '#2dd4bf', glow: 'rgba(45,212,191,0.6)', icon: 'droplet' },
  other: { id: 'other', label: 'Other', color: '#cbd5e1', glow: 'rgba(203,213,225,0.5)', icon: 'circle' },
};

/** Map an EONET category id to our normalized category. */
export function eonetCategoryToEvent(id: string): EventCategory {
  switch (id) {
    case 'earthquakes':
      return 'earthquake';
    case 'wildfires':
      return 'wildfire';
    case 'volcanoes':
      return 'volcano';
    case 'severeStorms':
      return 'severeStorms';
    case 'floods':
      return 'flood';
    case 'landslides':
      return 'landslide';
    case 'drought':
      return 'drought';
    case 'dustHaze':
      return 'dustHaze';
    case 'manmade':
      return 'manmade';
    case 'seaLakeIce':
      return 'seaLakeIce';
    case 'snow':
      return 'snow';
    case 'tempExtremes':
      return 'tempExtremes';
    case 'waterColor':
      return 'waterColor';
    default:
      return 'other';
  }
}

/** Friendly label for a category id. */
export function categoryLabel(id: EventCategory): string {
  return CATEGORY_META[id]?.label ?? id;
}

/** Hex color for a category id. */
export function categoryColor(id: EventCategory): string {
  return CATEGORY_META[id]?.color ?? '#cbd5e1';
}

/** All categories exposed in filters, in display order. */
export const ALL_CATEGORIES: EventCategory[] = [
  'earthquake',
  'wildfire',
  'volcano',
  'severeStorms',
  'flood',
  'landslide',
  'drought',
  'dustHaze',
  'seaLakeIce',
  'snow',
  'tempExtremes',
  'waterColor',
  'manmade',
  'other',
];
