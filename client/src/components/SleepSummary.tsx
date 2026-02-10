import type { MoodEntry } from "../types";
import arrowUp from "../assets/images/icon-trend-increase-white.svg";
import arrowDown from "../assets/images/icon-trend-decrease-white.svg";
import arrowSame from "../assets/images/icon-trend-same-white.svg";
import sleepIcons from "../assets/images/icon-sleep-white.svg";

const sleepMidpoint = {
  "0-2 hours": 1,
  "3-4 hours": 3.5,
  "5-6 hours": 5.5,
  "7-8 hours": 7.5,
  "9+ hours": 9,
};

const getArrowIcon = (diff: number): string => {
  if (diff > 0) return arrowUp;
  if (diff < 0) return arrowDown;
  return arrowSame;
};

const SleepSummary = ({ entries }: { entries: MoodEntry[] }) => {
  if (entries.length < 1) {
    return (
      <div className="sleep-summary-box">
        <h2 className="mb-3">
          <span className="font-semibold text-[20px]/[1.4]">Average Sleep </span> 
          <span className="text-mood-neutral-600 text-[15px]/[1.4]">(Last 5 Check-ins)</span>
        </h2>
        <div className="bg-mood-blue-100 rounded-2xl p-5 summary-message">
          <h3 className="font-semibold text-[24px]/[140%] mt-5 mb-3">Not enough data yet!</h3>
          <p className="text-[15px]/[140%] mb-6">Track 5 nights to view average sleep.</p>
        </div>
      </div>
    );
  }

  const last5 = entries.slice(-5);
  const prev5 = entries.slice(-10, -5);

  const avgSleep = (group: MoodEntry[]) =>
    group.reduce((sum, e) => sum + (sleepMidpoint[e.sleepRange] || 0), 0) / group.length;

  const currentAvg = avgSleep(last5);
  const prevAvg = avgSleep(prev5);
  const diff = currentAvg - prevAvg;

  const formatted = `${currentAvg.toFixed(1)} hrs`;

  return (
    <div>
      <h2 className="mb-3">
        <span className="font-semibold text-[20px]/[1.4]">Average Sleep </span> 
        <span className="text-mood-neutral-600 text-[15px]/[1.4]">(Last 5 Check-ins)</span>
      </h2>
      <div className="bg-mood-blue-600 rounded-2xl p-5 summary-message space-y-3 text-white">
        <h3 className="font-semibold text-2xl/[1.4] mt-4 mb-3 flex item-center gap-3">
          <img
            src={sleepIcons}
            alt={formatted}
            className="w-6 h-6 mt-1"
            width={24}
            height={24}
          />
          <span>{formatted}</span>
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

export default SleepSummary;
