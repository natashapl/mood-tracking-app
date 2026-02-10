import moodQuotes from "../data/data.json";

type MoodQuoteKey = "-2" | "-1" | "0" | "1" | "2";

export function getRandomQuoteForMood(moodValue: number): string {
  const key = moodValue.toString() as MoodQuoteKey;
  const quotes = moodQuotes.moodQuotes[key];
  if (!quotes || quotes.length === 0) return "";
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index];
}
