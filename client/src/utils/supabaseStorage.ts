import { supabase } from '../lib/supabase';
import type { MoodEntryDB } from '../lib/supabase';
import type { MoodEntry } from '../types';

// Convert database format to app format
const dbToAppFormat = (dbEntry: MoodEntryDB): MoodEntry => ({
  id: dbEntry.id,
  date: dbEntry.date,
  mood: dbEntry.mood,
  feelings: dbEntry.feelings,
  reflection: dbEntry.reflection || '',
  sleepRange: dbEntry.sleep_range,
});

// Convert app format to database format
const appToDbFormat = (entry: Omit<MoodEntry, 'id'>, userId: string): Omit<MoodEntryDB, 'id' | 'created_at' | 'updated_at'> => ({
  user_id: userId,
  date: entry.date,
  mood: entry.mood,
  feelings: entry.feelings,
  reflection: entry.reflection || null,
  sleep_range: entry.sleepRange,
});

export const loadMoodEntriesFromSupabase = async (): Promise<MoodEntry[]> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error loading mood entries:', error);
    return [];
  }

  return data ? data.map(dbToAppFormat) : [];
};

export const saveMoodEntryToSupabase = async (entry: MoodEntry): Promise<{ success: boolean; error?: any }> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: new Error('No user logged in') };
  }

  const dbEntry = appToDbFormat(entry, user.id);

  // Try to update first (if entry exists for this date)
  const { data: existing } = await supabase
    .from('mood_entries')
    .select('id')
    .eq('user_id', user.id)
    .eq('date', entry.date)
    .single();

  if (existing) {
    // Update existing entry
    const { error } = await supabase
      .from('mood_entries')
      .update({ ...dbEntry, updated_at: new Date().toISOString() })
      .eq('id', existing.id);

    return { success: !error, error };
  } else {
    // Insert new entry
    const { error } = await supabase
      .from('mood_entries')
      .insert([dbEntry]);

    return { success: !error, error };
  }
};

export const deleteMoodEntryFromSupabase = async (entryId: string): Promise<{ success: boolean; error?: any }> => {
  const { error } = await supabase
    .from('mood_entries')
    .delete()
    .eq('id', entryId);

  return { success: !error, error };
};

// Upload avatar to Supabase Storage
export const uploadAvatar = async (file: File, userId: string): Promise<{ url: string | null; error: any }> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/avatar.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, { upsert: true });

  if (uploadError) {
    return { url: null, error: uploadError };
  }

  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  return { url: data.publicUrl, error: null };
};
