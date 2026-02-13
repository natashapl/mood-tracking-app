import { describe, it, expect, beforeEach } from 'vitest';
import { loadMoodEntries, saveMoodEntries } from '../storage';
import type { MoodEntry } from '../../types';

const mockEntry: MoodEntry = {
  id: '1',
  date: '2025-02-13',
  mood: 'Happy',
  feelings: ['Grateful', 'Calm'],
  reflection: 'Good day',
  sleepRange: '7-8 hours',
};

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('loadMoodEntries', () => {
    it('returns an empty array when nothing is stored', () => {
      expect(loadMoodEntries()).toEqual([]);
    });

    it('returns parsed entries from localStorage', () => {
      localStorage.setItem('moodEntries', JSON.stringify([mockEntry]));
      expect(loadMoodEntries()).toEqual([mockEntry]);
    });

    it('returns an empty array if localStorage contains invalid JSON', () => {
      localStorage.setItem('moodEntries', 'not valid json');
      expect(loadMoodEntries()).toEqual([]);
    });
  });

  describe('saveMoodEntries', () => {
    it('saves entries to localStorage', () => {
      saveMoodEntries([mockEntry]);
      const stored = localStorage.getItem('moodEntries');
      expect(stored).toBe(JSON.stringify([mockEntry]));
    });

    it('saves an empty array', () => {
      saveMoodEntries([]);
      const stored = localStorage.getItem('moodEntries');
      expect(stored).toBe('[]');
    });
  });
});
