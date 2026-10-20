import { describe, it, expect } from 'vitest';
import { HttpError, describeError, clearCache } from '@/services/http';

describe('HTTP error handling', () => {
  it('describes timeout errors', () => {
    const err = new HttpError('Request timed out', undefined, true);
    expect(describeError(err)).toContain('timed out');
  });

  it('describes 5xx upstream errors', () => {
    const err = new HttpError('HTTP 503', 503);
    expect(describeError(err)).toContain('Upstream service error');
  });

  it('describes 429 rate limits', () => {
    const err = new HttpError('HTTP 429', 429);
    expect(describeError(err)).toContain('Rate limit');
  });

  it('describes generic errors and unknown values', () => {
    expect(describeError(new Error('boom'))).toBe('boom');
    expect(describeError('something odd')).toBe('Unknown error');
  });

  it('clearing the cache is a safe no-op', () => {
    expect(() => clearCache()).not.toThrow();
    expect(() => clearCache('nonexistent-key')).not.toThrow();
  });
});
