import { describe, it, expect } from 'vitest';
import {
  gibsTileTemplate,
  GIBS_LAYERS,
  GIBS_EARLIEST,
  gibsMaxSelectableDate,
  isGibsDateSelectable,
} from '@/services/gibs';

describe('GIBS service', () => {
  it('every curated layer is raster with a verified matrix set + maxLevel', () => {
    for (const layer of GIBS_LAYERS) {
      expect(layer.format).toMatch(/^(png|jpeg)$/);
      expect(layer.matrixSet).toMatch(/^GoogleMapsCompatible_Level\d+$/);
      expect(layer.maxLevel).toBeGreaterThan(0);
      expect(layer.temporal).toBe(true);
    }
  });

  it('builds a Leaflet-compatible tile URL with the date and matrix set baked in', () => {
    const layer = GIBS_LAYERS.find((l) => l.id === 'MODIS_Terra_CorrectedReflectance_TrueColor')!;
    const url = gibsTileTemplate(layer, '2026-10-19');
    expect(url).toContain('/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2026-10-19/');
    expect(url).toContain('GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpeg');
  });

  it('uses the correct extension per layer format', () => {
    const png = GIBS_LAYERS.find((l) => l.format === 'png')!;
    expect(gibsTileTemplate(png, '2026-10-19')).toMatch(/\.png$/);
    const jpeg = GIBS_LAYERS.find((l) => l.format === 'jpeg')!;
    expect(gibsTileTemplate(jpeg, '2026-10-19')).toMatch(/\.jpeg$/);
  });

  it('exposes a sensible earliest-date bound', () => {
    expect(GIBS_EARLIEST).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('GIBS selectable date range (calendar fix)', () => {
  // A fixed "now" so assertions are deterministic: 2026-10-21T23:00:00Z.
  const NOW = Date.UTC(2026, 9, 21, 23, 0, 0);
  const TODAY = '2026-10-21';
  const YESTERDAY = '2026-10-20';
  const TOMORROW = '2026-10-22';

  it('max selectable date is the real current UTC date (not yesterday, not future)', () => {
    expect(gibsMaxSelectableDate(NOW)).toBe(TODAY);
    expect(gibsMaxSelectableDate(NOW)).not.toBe(YESTERDAY);
  });

  it('the selectable range is valid: earliest <= today', () => {
    expect(GIBS_EARLIEST <= gibsMaxSelectableDate(NOW)).toBe(true);
  });

  it('accepts yesterday, today, and supported historical dates', () => {
    expect(isGibsDateSelectable(YESTERDAY, NOW)).toBe(true);
    expect(isGibsDateSelectable(TODAY, NOW)).toBe(true);
    expect(isGibsDateSelectable('2020-06-15', NOW)).toBe(true);
    expect(isGibsDateSelectable(GIBS_EARLIEST, NOW)).toBe(true);
  });

  it('rejects future dates (tomorrow and beyond)', () => {
    expect(isGibsDateSelectable(TOMORROW, NOW)).toBe(false);
    expect(isGibsDateSelectable('2027-01-01', NOW)).toBe(false);
  });

  it('rejects dates before the earliest supported GIBS date', () => {
    expect(isGibsDateSelectable('2012-05-07', NOW)).toBe(false);
    expect(isGibsDateSelectable('2000-01-01', NOW)).toBe(false);
  });

  it('does not restrict the default selected layer date to yesterday (today is allowed)', () => {
    // The bug previously forced the max to yesterday; today must now be selectable.
    const layerDefaults = GIBS_LAYERS.map((l) => l.defaultDate).filter(Boolean) as string[];
    for (const d of layerDefaults) {
      expect(isGibsDateSelectable(d, NOW)).toBe(true);
    }
  });
});
