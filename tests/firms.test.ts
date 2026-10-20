import { describe, it, expect } from 'vitest';
import { parseFirmsCsv, normalizeFirms } from '@/services/firms';

const sampleCsv = `latitude,longitude,bright_ti4,scan,track,acq_date,acq_time,satellite,confidence,vers,bright_ti5,frp,daynight
36.123,-118.456,320.5,0.4,0.4,2026-10-19,0530,N,80,2.0N,310.1,42.3,N
36.200,-118.500,300.1,0.5,0.5,2026-10-19,0600,N,high,2.0N,295.0,38.1,N`;

describe('FIRMS CSV parsing', () => {
  it('parses detections and preserves all fields', () => {
    const detections = parseFirmsCsv(sampleCsv);
    expect(detections).toHaveLength(2);
    const first = detections[0];
    expect(first.latitude).toBe(36.123);
    expect(first.longitude).toBe(-118.456);
    expect(first.brightTi4).toBe(320.5);
    expect(first.acqDate).toBe('2026-10-19');
    expect(first.acqTime).toBe('0530');
    expect(first.satellite).toBe('N');
    expect(first.confidence).toBe(80); // numeric confidence preserved
    expect(first.frp).toBe(42.3);
    expect(first.daynight).toBe('N');
    expect(first.time).toBe(Date.parse('2026-10-19T05:30:00Z'));
  });

  it('maps high confidence string to numeric value', () => {
    const detections = parseFirmsCsv(sampleCsv);
    expect(detections[1].confidence).toBe(90); // 'high'
  });

  it('maps low/nominal confidence strings to numeric values', () => {
    const csv = `latitude,longitude,bright_ti4,scan,track,acq_date,acq_time,satellite,confidence,vers,bright_ti5,frp,daynight
36.0,-118.0,300,0.4,0.4,2026-10-19,0100,N,low,2.0N,290,40,N
36.1,-118.1,300,0.4,0.4,2026-10-19,0200,N,nominal,2.0N,290,40,N`;
    const detections = parseFirmsCsv(csv);
    expect(detections[0].confidence).toBe(30); // low
    expect(detections[1].confidence).toBe(65); // nominal
  });

  it('skips malformed rows', () => {
    const csv = `latitude,longitude,bright_ti4,scan,track,acq_date,acq_time,satellite,confidence,vers,bright_ti5,frp,daynight
,,x,x,x,x,x,x,x,x,x,x,x
not,a,line
36.0,-118.0,300,0.4,0.4,2026-10-19,0100,N,90,2.0N,290,40,N`;
    const detections = parseFirmsCsv(csv);
    expect(detections).toHaveLength(1);
    expect(detections[0].latitude).toBe(36.0);
  });

  it('normalizes a detection to the common event model', () => {
    const detections = parseFirmsCsv(sampleCsv);
    const n = normalizeFirms(detections[0]);
    expect(n.source).toBe('firms');
    expect(n.category).toBe('wildfire');
    expect(n.magnitude).toBe(42.3);
    expect(n.magnitudeUnit).toBe('MW');
    expect(n.confidence).toBe(80);
    expect(n.title).toContain('36.123');
  });

  it('returns an empty array for empty input', () => {
    expect(parseFirmsCsv('')).toEqual([]);
    expect(parseFirmsCsv('   \n\n')).toEqual([]);
  });
});
