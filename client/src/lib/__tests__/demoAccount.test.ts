import { describe, it, expect } from 'vitest';
import { DEMO_EMAIL, DEMO_PASSWORD, isDemoUser } from '../demoAccount';

describe('demoAccount', () => {
  it('exports the correct demo credentials', () => {
    expect(DEMO_EMAIL).toBe('jane@demo.com');
    expect(DEMO_PASSWORD).toBe('Jane1234');
  });

  describe('isDemoUser', () => {
    it('returns true for the demo email', () => {
      expect(isDemoUser('jane@demo.com')).toBe(true);
    });

    it('returns false for a different email', () => {
      expect(isDemoUser('other@example.com')).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isDemoUser(undefined)).toBe(false);
    });

    it('returns false for an empty string', () => {
      expect(isDemoUser('')).toBe(false);
    });
  });
});
