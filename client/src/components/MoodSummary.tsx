import type { MoodEntry } from "../types";
import arrowUp from "../assets/images/icon-trend-increase.svg";
import arrowDown from "../assets/images/icon-trend-decrease.svg";
import arrowSame from "../assets/images/icon-trend-same.svg";
import moodIcons from "../assets/moodImages";

const moodLabelFromValue = (value: number): MoodEntry["mood"] => {
  if (value <= -2) return "Very Sad";
  if (value === -1) return "Sad";
  if (value === 0) return "Neutral";
  if (value === 1) return "Happy";
  return "Very Happy";
};

const getArrowIcon = (diff: number): string => {
  if (diff > 0) return arrowUp;
  if (diff < 0) return arrowDown;
  return arrowSame;
};

const MoodSummary = ({ entries }: { entries: MoodEntry[] }) => {
  if (entries.length < 1) {
    return (
      <div className="mood-summary-box mb-6">
        <h2 className="mb-3">
          <span className="font-semibold text-2xl/[1.4]">Average Mood </span> 
          <span className="text-mood-neutral-600 text-[15px]/[1.4]">(Last 5 Check-ins)</span>
        </h2>
        <div className="bg-[#e0e6fa] rounded-2xl p-5 summary-message">
          <h3 className="font-semibold text-2xl/[1.4] mt-5 mb-3">Keep tracking!</h3>
          <p className="text-[15px]/[140%] mb-6">Log 5 check-ins to see your average mood.</p>
        </div>
      </div>
    );
  }

  const last5 = entries.slice(-5);
  const prev5 = entries.slice(-10, -5);

  const getMoodValue = (mood: MoodEntry["mood"]): number => {
    return {
      "Very Sad": -2,
      "Sad": -1,
      "Neutral": 0,
      "Happy": 1,
      "Very Happy": 2,
    }[mood];
  };

  const avgMood = (group: MoodEntry[]) =>
    group.reduce((sum, e) => sum + getMoodValue(e.mood), 0) / group.length;

  const currentAvg = avgMood(last5);
  const prevAvg = avgMood(prev5);
  const diff = currentAvg - prevAvg;
  const label = moodLabelFromValue(Math.round(currentAvg));

  return (
    <div className="mood-summary-box mb-6">
      <h2 className="mb-3">
        <span className="font-semibold text-2xl/[1.4]">Average Mood </span> 
        <span className="text-mood-neutral-600 text-[15px]/[1.4]">(Last 5 Check-ins)</span>
      </h2>
      <div className="bg-[#e0e6fa] rounded-2xl p-5 summary-message space-y-3">
        <h3 className="font-semibold text-2xl/[1.4] mt-4 mb-3 flex item-center gap-3">
          <img
            src={moodIcons[label]}
            alt={label}
            className="w-6 h-6 mt-1"
            width={24}
            height={24}
          />
          <span>{label}</span>
        </h3>
        <p className="text-[15px]/[1.4] flex item-center mb-4 gap-3">
          <img
            src={getArrowIcon(diff)}
            alt="arrow"
            className="w-[15px] h-4"
            width={15}
            height={16}
          />
          <span>from previous 5</span>
        </p>
       
      </div>
    </div>
  );
};

export default MoodSummary;
