import Header from "../components/Header";
import Greeting from "../components/Greeting";
import MoodSummary from "../components/MoodSummary";
import SleepSummary from "../components/SleepSummary";
import TrendsChart from "../components/TrendsChart";
import { useEffect, useState, useCallback } from "react";
import type { MoodEntry } from "../types";
import { loadMoodEntriesFromSupabase } from "../utils/supabaseStorage";
import MoodWizard from "../components/MoodWizard/MoodWizard";
import TodayMoodSummary from "../components/TodayMoodSummary";
import { getLocalDateString } from "../utils/date";
import TodaySleepAndReflection from "../components/TodaySleepAndReflection";
import SettingsModal from "../components/SettingsModal";



const HomePage = () => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshEntries = useCallback(async () => {
    try {
      const updated = await loadMoodEntriesFromSupabase();
      setEntries(updated);
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  }, []);

  const handleCloseWizard = useCallback(() => {
    refreshEntries();
    setShowWizard(false);
  }, [refreshEntries]);

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const updated = await loadMoodEntriesFromSupabase();
        setEntries(updated);
      } catch (error) {
        console.error('Error loading entries:', error);
      } finally {
        setLoading(false);
      }
    };
    loadEntries();
  }, []);

  const today = getLocalDateString();
  const todayEntry = entries
    .filter((entry) => entry.date === today)
    .sort((a, b) => Number(a.id) - Number(b.id))
    .slice(-1)[0];

  if (loading) {
    return (
      <div className="min-h-screen min-w-[430px] bg-gradient-to-b from-[#f5f5ff] from-73% to-[#e0e0ff] flex items-center justify-center">
        <div className="text-[20px]/[1.4] text-mood-neutral-600">Loading your mood data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-w-[430px] bg-gradient-to-b from-[#f5f5ff] from-73% to-[#e0e0ff] relative px-4 pt-8 md:px-8 md:pt-10">
      <Header onOpenSettings={() => setShowSettings(true)} />

      <main className="max-w-[1170px] min-w-[335px] mx-auto pb-20">
        <Greeting />
        <p className="text-center">
          <button
            type="button"
            className="mt-12 lg:mt-16 bg-mood-blue-600 text-white text-[20px]/[1.4] px-8 pt-3 pb-4 rounded-[10px] hover:bg-mood-blue-700 transition shadow cursor-pointer"
            onClick={() => setShowWizard(true)}
          >
            {todayEntry ? "Edit today's mood" : "Log today's mood"}
          </button>
        </p>

        {showWizard && (
          <MoodWizard
            onClose={handleCloseWizard}
            refreshEntries={refreshEntries}
            existingEntry={todayEntry}
          />
        )}

        {showSettings && (
          <SettingsModal onClose={() => setShowSettings(false)} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-12 md:mt-16 items-stretch">
          
          <div className="col-start-1 col-end-13 md:col-span-8 lg:col-span-7">
            {todayEntry && <TodayMoodSummary entry={todayEntry} />}
          </div>

          <div className="col-start-1 col-end-13 md:col-span-4 lg:col-span-5">
            {todayEntry && <TodaySleepAndReflection entry={todayEntry} />}
          </div>

          <div className="bg-white rounded-2xl border border-mood-blue-100 p-6 space-y-6 col-start-1 col-end-13 md:col-span-4 md:max-w-[370px]">
            <MoodSummary entries={entries} />
            <SleepSummary entries={entries} />
          </div>

          <div className="bg-white rounded-2xl border border-mood-blue-100 p-6 col-start-1 col-end-13 md:col-span-8">
            <TrendsChart entries={entries} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;