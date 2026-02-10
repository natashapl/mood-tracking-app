export type MoodEntry = {
  id: string;
  date: string;
  mood: "Very Sad" | "Sad" | "Neutral" | "Happy" | "Very Happy";
  feelings: string[];
  reflection: string;
  sleepRange: "0-2 hours" | "3-4 hours" | "5-6 hours" | "7-8 hours" | "9+ hours";
};
