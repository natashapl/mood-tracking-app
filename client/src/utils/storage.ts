import type { MoodEntry } from "../types";

const STORAGE_KEY = "moodEntries";

export function loadMoodEntries(): MoodEntry[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveMoodEntries(entries: MoodEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
