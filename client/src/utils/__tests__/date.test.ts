import { describe, it, expect, vi, afterEach } from 'vitest';
import { getLocalDateString } from '../date';

describe('getLocalDateString', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns a string in YYYY-MM-DD format', () => {
    const result = getLocalDateString();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('pads single-digit months and days with leading zeros', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 0, 5)); // January 5, 2025
    expect(getLocalDateString()).toBe('2025-01-05');
    vi.useRealTimers();
  });

  it('handles double-digit months and days', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 11, 25)); // December 25, 2025
    expect(getLocalDateString()).toBe('2025-12-25');
    vi.useRealTimers();
  });
});
