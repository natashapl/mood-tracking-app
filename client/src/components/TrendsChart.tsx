import { useState, useRef, useEffect } from "react";
import type { MoodEntry } from "../types";
import moodIconsColor from "../assets/moodImagesColor";
import sleepIcons from "../assets/images/icon-sleep.svg";

// Map mood to color for bars
const moodColors: Record<MoodEntry["mood"], string> = {
  "Very Happy": "#F9C062",
  "Happy": "#8AC97D",
  "Neutral": "#74A2F1",
  "Sad": "#A491D2",
  "Very Sad": "#E88989",
};

// Map sleep range to numeric value for chart height
const sleepToValue = (sleep: MoodEntry["sleepRange"]): number => {
  const map: Record<MoodEntry["sleepRange"], number> = {
    "0-2 hours": 1,
    "3-4 hours": 3.5,
    "5-6 hours": 5.5,
    "7-8 hours": 7.5,
    "9+ hours": 9,
  };
  return map[sleep];
};

const TrendsChart = ({ entries }: { entries: MoodEntry[] }) => {
  const [selectedBar, setSelectedBar] = useState<number | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const chartRef = useRef<HTMLDivElement>(null);

  // Sort entries by date and deduplicate (keep latest entry per day)
  const sortedEntries = [...entries].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Keep only the most recent entry per day
  const deduplicatedEntries = sortedEntries.reduce((acc, entry) => {
    const existingIndex = acc.findIndex(e => e.date === entry.date);
    if (existingIndex >= 0) {
      // Replace with newer entry (higher ID = newer)
      if (Number(entry.id) > Number(acc[existingIndex].id)) {
        acc[existingIndex] = entry;
      }
    } else {
      acc.push(entry);
    }
    return acc;
  }, [] as MoodEntry[]);

  // Get last 11 unique days
  const chartData = deduplicatedEntries.slice(-11);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectedBar !== null && chartRef.current && !chartRef.current.contains(e.target as Node)) {
        setSelectedBar(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedBar]);

  if (chartData.length === 0) {
    return (
      <div className="trend-chart-container">
        <h2 className="font-bold text-[28px]/[1.3] md:text-[32px]/[1.4] mb-8">
          Mood and sleep trends
        </h2>
        <div className="text-sm text-center py-16 text-mood-neutral-600">
          No trend data yet. Log your first mood to see trends!
        </div>
      </div>
    );
  }

  const maxHeight = 9; // 9+ hours is max
  // Chart container height minus padding and emoji space
  // Container: 280px, pb-3: 12px, emoji + margin: ~40px
  const chartHeightPx = 230; // Available height for bars
  const isSparse = chartData.length < 6;

  const handleBarClick = (index: number, event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    setPopoverPosition({ x, y });
    setSelectedBar(index);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const day = date.getDate();
    return { month, day };
  };

  return (
    <div className="trend-chart-container relative" ref={chartRef}>
      <h2 className="font-bold text-[28px]/[1.3] md:text-[32px]/[1.4] mb-8">
        Mood and sleep trends
      </h2>

      {/* Chart */}
      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-12 flex flex-col justify-between text-[13px]/[1.4] text-mood-neutral-600 pr-2">
          <div className="flex items-center gap-1">
            <span className="inline-block w-3 h-3">
              <img src={sleepIcons} alt="" className="w-full h-full" />
            </span>
            <span>9+ hours</span>
          </div>
          <div className="pl-4">7-8 hours</div>
          <div className="pl-4">5-6 hours</div>
          <div className="pl-4">3-4 hours</div>
          <div className="pl-4">0-2 hours</div>
        </div>

        {/* Chart bars */}
        <div className={`ml-24 md:ml-28 flex items-end ${isSparse ? 'justify-start gap-2 sm:gap-4 md:gap-6' : 'justify-between gap-1 sm:gap-2 md:gap-2.5'} h-[280px] border-b border-mood-neutral-300 pb-3`}>
          {chartData.map((entry, index) => {
            const sleepValue = sleepToValue(entry.sleepRange);
            const heightPx = Math.max((sleepValue / maxHeight) * chartHeightPx, 20);
            const color = moodColors[entry.mood];

            return (
              <div
                key={entry.id}
                className={`flex flex-col items-center justify-end cursor-pointer transition-opacity hover:opacity-80 min-w-[18px] max-w-[22px] sm:max-w-[26px] md:max-w-[30px] lg:max-w-[38px] xl:max-w-[44px] ${isSparse ? 'w-[22px] sm:w-[26px] md:w-[30px] lg:w-[38px] xl:w-[44px]' : 'flex-1'}`}
                onClick={(e) => handleBarClick(index, e)}
              >
                {/* Mood emoji on top */}
                <div className="mb-1 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 flex items-center justify-center">
                  <img
                    src={moodIconsColor[entry.mood]}
                    alt={entry.mood}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Bar */}
                <div
                  className="w-full rounded-full transition-all"
                  style={{
                    height: `${heightPx}px`,
                    backgroundColor: color,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className={`ml-24 md:ml-28 flex ${isSparse ? 'justify-start gap-2 sm:gap-4 md:gap-6' : 'justify-between gap-1 sm:gap-2 md:gap-2.5'} mt-2`}>
          {chartData.map((entry) => {
            const { month, day } = formatDate(entry.date);
            return (
              <div
                key={entry.id}
                className={`text-center text-[10px]/[1.4] sm:text-[11px]/[1.4] md:text-[13px]/[1.4] text-mood-neutral-600 min-w-[18px] max-w-[22px] sm:max-w-[26px] md:max-w-[30px] lg:max-w-[38px] xl:max-w-[44px] ${isSparse ? 'w-[22px] sm:w-[26px] md:w-[30px] lg:w-[38px] xl:w-[44px]' : 'flex-1'}`}
              >
                <div>{month}</div>
                <div className="font-semibold">{day}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Popover */}
      {selectedBar !== null && (
        <div
          className="fixed bg-white rounded-xl shadow-2xl border border-mood-blue-100 p-5 w-[280px] z-50"
          style={{
            left: `${popoverPosition.x}px`,
            top: `${popoverPosition.y - 10}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="space-y-3">
            {/* Mood */}
            <div className="flex items-center gap-2">
              <span className="text-[15px]/[1.4] font-medium">Mood</span>
              <div className="flex items-center gap-2">
                <img
                  src={moodIconsColor[chartData[selectedBar].mood]}
                  alt={chartData[selectedBar].mood}
                  className="w-5 h-5"
                />
                <span className="text-[15px]/[1.4] font-semibold">
                  {chartData[selectedBar].mood}
                </span>
              </div>
            </div>

            {/* Sleep */}
            <div className="flex items-center gap-2">
              <span className="text-[15px]/[1.4] font-medium">Sleep</span>
              <span className="text-[15px]/[1.4] font-semibold">
                {chartData[selectedBar].sleepRange}
              </span>
            </div>

            {/* Reflection */}
            {chartData[selectedBar].reflection && (
              <div>
                <div className="text-[15px]/[1.4] font-medium mb-1">Reflection</div>
                <p className="text-[14px]/[1.4] text-mood-neutral-700">
                  {chartData[selectedBar].reflection}
                </p>
              </div>
            )}

            {/* Tags */}
            {chartData[selectedBar].feelings.length > 0 && (
              <div>
                <div className="text-[15px]/[1.4] font-medium mb-1">Tags</div>
                <p className="text-[14px]/[1.4] text-mood-neutral-700">
                  {chartData[selectedBar].feelings.join(", ")}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendsChart;
