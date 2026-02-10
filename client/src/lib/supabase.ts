import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for database tables
export type Profile = {
  id: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type MoodEntryDB = {
  id: string;
  user_id: string;
  date: string;
  mood: 'Very Happy' | 'Happy' | 'Neutral' | 'Sad' | 'Very Sad';
  feelings: string[];
  reflection: string | null;
  sleep_range: '0-2 hours' | '3-4 hours' | '5-6 hours' | '7-8 hours' | '9+ hours';
  created_at: string;
  updated_at: string;
};
