import { describe, it, expect } from 'vitest';
import { normalizeApod } from '@/services/nasa';

describe('NASA APOD normalization', () => {
  it('normalizes a valid image APOD', () => {
    const n = normalizeApod({
      title: 'A Spiral Galaxy',
      date: '2026-10-19',
      explanation: '  A stunning view of NGC 1234.  ',
      media_type: 'image',
      url: 'https://example/apod.jpg',
      hdurl: 'https://example/apod_hd.jpg',
      copyright: 'Jane Doe',
    });
    expect(n.title).toBe('A Spiral Galaxy');
    expect(n.mediaType).toBe('image');
    expect(n.explanation).toBe('A stunning view of NGC 1234.');
    expect(n.hdurl).toBe('https://example/apod_hd.jpg');
    expect(n.copyright).toBe('Jane Doe');
  });

  it('defaults media_type to image when missing and handles video', () => {
    expect(normalizeApod({ url: 'x', date: '2026-10-19', title: 'T' }).mediaType).toBe('image');
    expect(normalizeApod({ url: 'x', date: '2026-10-19', title: 'T', media_type: 'video' }).mediaType).toBe('video');
  });

  it('tolerates missing fields without throwing', () => {
    const n = normalizeApod({ date: '2026-10-19', url: 'https://example/x' });
    expect(n.title).toBe('Untitled');
    expect(n.explanation).toBe('');
    expect(n.hdurl).toBeNull();
  });

  it('treats an empty title as Untitled and trims whitespace', () => {
    expect(normalizeApod({ url: 'x', date: 'd', title: '   ' }).title).toBe('Untitled');
  });
});
