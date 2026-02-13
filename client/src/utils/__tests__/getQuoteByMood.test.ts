import { describe, it, expect } from 'vitest';
import { getRandomQuoteForMood } from '../getQuoteByMood';

describe('getRandomQuoteForMood', () => {
  it('returns a non-empty string for mood value 2 (Very Happy)', () => {
    const quote = getRandomQuoteForMood(2);
    expect(quote).toBeTruthy();
    expect(typeof quote).toBe('string');
  });

  it('returns a non-empty string for mood value 1 (Happy)', () => {
    const quote = getRandomQuoteForMood(1);
    expect(quote).toBeTruthy();
  });

  it('returns a non-empty string for mood value 0 (Neutral)', () => {
    const quote = getRandomQuoteForMood(0);
    expect(quote).toBeTruthy();
  });

  it('returns a non-empty string for mood value -1 (Sad)', () => {
    const quote = getRandomQuoteForMood(-1);
    expect(quote).toBeTruthy();
  });

  it('returns a non-empty string for mood value -2 (Very Sad)', () => {
    const quote = getRandomQuoteForMood(-2);
    expect(quote).toBeTruthy();
  });

  it('returns an empty string for an invalid mood value', () => {
    const quote = getRandomQuoteForMood(99);
    expect(quote).toBe('');
  });
});
