/**
 * Testing utilities for the mood tracker app
 *
 * To use these in the browser console:
 * - addSampleData() - Add 11 days of sample data
 * - addTestEntry(date, mood, feelings, reflection, sleep) - Add entry for specific date
 * - viewAllEntries() - View all entries in console
 * - clearSampleData() - Clear only sample/test entries
 * - clearAllEntries() - Clear all entries
 * - setupDemoProfile() - Set demo account name and avatar
 */

import type { MoodEntry } from "../types";
import { loadMoodEntriesFromSupabase, saveMoodEntryToSupabase } from "./supabaseStorage";
import { supabase } from "../lib/supabase";
import avatarLisa from "../assets/images/avatar-lisa.jpg";

/**
 * Add a mood entry for a specific date (for testing)
 * Usage in console: addTestEntry('2025-04-10', 'Happy', ['Joyful'], 'Great day!', '7-8 hours')
 */
export async function addTestEntry(
  dateString: string, // Format: YYYY-MM-DD
  mood: MoodEntry["mood"],
  feelings: string[],
  reflection: string,
  sleepRange: MoodEntry["sleepRange"]
) {
  const newEntry: MoodEntry = {
    id: Date.now().toString() + Math.random(),
    date: dateString,
    mood,
    feelings,
    reflection,
    sleepRange,
  };

  const { success, error } = await saveMoodEntryToSupabase(newEntry);

  if (success) {
    console.log(`✅ Added/updated entry for ${dateString}`);
    console.log("Entry:", newEntry);
    // Reload page to see changes
    window.location.reload();
  } else {
    console.error("❌ Failed to save entry:", error);
  }
}

/**
 * Add sample data for the last 11 days (for testing the chart)
 * Usage in console: addSampleData()
 */
export async function addSampleData() {
  console.log("🔄 Adding sample data...");

  const moods: MoodEntry["mood"][] = ["Very Happy", "Happy", "Neutral", "Sad", "Very Sad"];
  const sleepRanges: MoodEntry["sleepRange"][] = ["0-2 hours", "3-4 hours", "5-6 hours", "7-8 hours", "9+ hours"];
  const feelings = [
    ["Joyful", "Motivated"],
    ["Grateful", "Calm"],
    ["Peaceful"],
    ["Tired", "Down"],
    ["Anxious", "Overwhelmed"],
  ];

  const existing = await loadMoodEntriesFromSupabase();
  const today = new Date();
  let addedCount = 0;
  let skippedCount = 0;

  for (let i = 10; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];

    // Check if entry already exists for this date
    const alreadyExists = existing.some(e => e.date === dateString);
    if (alreadyExists) {
      console.log(`⏭️  Entry already exists for ${dateString}, skipping`);
      skippedCount++;
      continue;
    }

    // Last entry (today, i === 0) is always Happy
    const moodIndex = i === 0 ? 1 : Math.floor(Math.random() * moods.length);
    const newEntry: MoodEntry = {
      id: Date.now().toString() + Math.random(),
      date: dateString,
      mood: moods[moodIndex],
      feelings: feelings[moodIndex],
      reflection: `Test reflection for ${dateString}. Feeling ${moods[moodIndex].toLowerCase()} today.`,
      sleepRange: i === 0 ? "7-8 hours" : sleepRanges[Math.floor(Math.random() * sleepRanges.length)],
    };

    const { success, error } = await saveMoodEntryToSupabase(newEntry);

    if (success) {
      console.log(`✅ Added entry for ${dateString}`);
      addedCount++;
    } else {
      console.error(`❌ Failed to add entry for ${dateString}:`, error);
    }
  }

  console.log(`✨ Sample data complete! Added ${addedCount} entries, skipped ${skippedCount} existing.`);

  // Reload page to see changes
  window.location.reload();
}

/**
 * Clear only sample/test entries (keeps your real entries)
 * Usage in console: clearSampleData()
 */
export async function clearSampleData() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error("❌ No user logged in");
    return;
  }

  console.log("🔄 Finding sample data entries...");

  const { data: entries, error: fetchError } = await supabase
    .from('mood_entries')
    .select('id, reflection')
    .eq('user_id', user.id)
    .like('reflection', 'Test reflection for %');

  if (fetchError) {
    console.error("❌ Failed to fetch entries:", fetchError);
    return;
  }

  if (!entries || entries.length === 0) {
    console.log("✅ No sample data found!");
    return;
  }

  console.log(`Found ${entries.length} sample entries to delete`);

  const { error } = await supabase
    .from('mood_entries')
    .delete()
    .eq('user_id', user.id)
    .like('reflection', 'Test reflection for %');

  if (error) {
    console.error("❌ Failed to clear sample data:", error);
  } else {
    console.log(`✅ Removed ${entries.length} sample entries!`);
    window.location.reload();
  }
}

/**
 * Clear all mood entries (for testing)
 * Usage in console: clearAllEntries()
 */
export async function clearAllEntries() {
  if (!confirm("⚠️  Are you sure you want to clear ALL mood entries? This cannot be undone!")) {
    console.log("Cancelled");
    return;
  }

  console.log("🔄 Clearing all entries...");

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error("❌ No user logged in");
    return;
  }

  const { error } = await supabase
    .from('mood_entries')
    .delete()
    .eq('user_id', user.id);

  if (error) {
    console.error("❌ Failed to clear entries:", error);
  } else {
    console.log("✅ All entries cleared!");
    window.location.reload();
  }
}

/**
 * View all entries in console
 * Usage in console: viewAllEntries()
 */
export async function viewAllEntries() {
  console.log("📊 Loading all entries...");
  const entries = await loadMoodEntriesFromSupabase();

  if (entries.length === 0) {
    console.log("📭 No entries found");
  } else {
    console.log(`📈 Found ${entries.length} entries:`);
    console.table(entries);
  }

  return entries;
}

/**
 * Remove duplicate entries (keep only the latest entry per day)
 * Usage in console: deduplicateEntries()
 */
export async function deduplicateEntries() {
  console.log("🔄 Checking for duplicates...");

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error("❌ No user logged in");
    return;
  }

  const entries = await loadMoodEntriesFromSupabase();

  // Group by date
  const dateMap = new Map<string, MoodEntry[]>();
  entries.forEach(entry => {
    const existing = dateMap.get(entry.date) || [];
    existing.push(entry);
    dateMap.set(entry.date, existing);
  });

  // Find duplicates
  const duplicates = Array.from(dateMap.entries())
    .filter(([_, entries]) => entries.length > 1);

  if (duplicates.length === 0) {
    console.log("✅ No duplicates found!");
    return;
  }

  console.log(`Found ${duplicates.length} dates with duplicates`);

  // Keep only the latest entry for each date (highest ID = newest)
  for (const [date, dupes] of duplicates) {
    // Sort by ID descending (keep first = newest)
    const sorted = dupes.sort((a, b) => Number(b.id) - Number(a.id));
    const keep = sorted[0];
    const toDelete = sorted.slice(1);

    console.log(`Date ${date}: keeping entry ${keep.id}, deleting ${toDelete.length} duplicates`);

    // Delete the old entries
    for (const entry of toDelete) {
      const { error } = await supabase
        .from('mood_entries')
        .delete()
        .eq('id', entry.id);

      if (error) {
        console.error(`❌ Failed to delete entry ${entry.id}:`, error);
      }
    }
  }

  const totalRemoved = duplicates.reduce((sum, [_, dupes]) => sum + dupes.length - 1, 0);
  console.log(`✅ Removed ${totalRemoved} duplicate entries!`);

  // Reload page to see changes
  window.location.reload();
}

/**
 * Set up the demo account profile (name and avatar)
 * Usage in console: setupDemoProfile()
 */
export async function setupDemoProfile() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error("❌ No user logged in");
    return;
  }

  console.log("🔄 Setting up demo profile...");

  // Fetch the bundled avatar image and upload to Supabase Storage
  const response = await fetch(avatarLisa);
  const blob = await response.blob();
  const file = new File([blob], 'avatar-lisa.jpg', { type: 'image/jpeg' });

  const filePath = `${user.id}/avatar.jpg`;
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error("❌ Failed to upload avatar:", uploadError);
    return;
  }

  const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  // Update profile with name and avatar
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      name: 'Jane',
      avatar_url: urlData.publicUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (updateError) {
    console.error("❌ Failed to update profile:", updateError);
  } else {
    console.log("✅ Demo profile set up! Name: Jane, Avatar: avatar-lisa.jpg");
    window.location.reload();
  }
}
