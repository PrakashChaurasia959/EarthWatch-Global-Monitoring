import { describe, it, expect } from 'vitest';
import { gibsTileTemplate, GIBS_LAYERS, GIBS_EARLIEST } from '@/services/gibs';

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
