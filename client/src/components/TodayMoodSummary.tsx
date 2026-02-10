import type { MoodEntry } from "../types";
import { getRandomQuoteForMood } from "../utils/getQuoteByMood";

import veryLow from "../assets/images/icon-very-sad-color.svg";
import low from "../assets/images/icon-sad-color.svg";
import neutral from "../assets/images/icon-neutral-color.svg";
import good from "../assets/images/icon-happy-color.svg";
import great from "../assets/images/icon-very-happy-color.svg";
import quoteIcon from "../assets/images/icon-quote.svg";

const moodLabelToValue: Record<MoodEntry["mood"], number> = {
  "Very Sad": -2,
  "Sad": -1,
  "Neutral": 0,
  "Happy": 1,
  "Very Happy": 2,
};

const moodImageMap: Record<MoodEntry["mood"], string> = {
  "Very Sad": veryLow,
  "Sad": low,
  "Neutral": neutral,
  "Happy": good,
  "Very Happy": great,
};

const TodayMoodSummary = ({ entry }: { entry: MoodEntry }) => {
  const moodValue = moodLabelToValue[entry.mood];
  const moodImage = moodImageMap[entry.mood];
  const quote = getRandomQuoteForMood(moodValue);

  return (
    <div className="today-mood-summary bg-white rounded-2xl border border-mood-blue-100 p-6 gap-6 relative overflow-hidden md:min-h-[340px] h-full z-0">
      {/* Left side: text */}
      <div className="text-center md:text-left">
        <p className="text-[32px]/[1.4] font-bold text-mood-neutral-900/[70%]">I’m feeling</p>
        <h2 className="text-[40px]/[1.2] font-bold">{entry.mood}</h2>
        <p className="mt-8 md:absolute md:top-4 md:right-9">
            <img
              src={moodImage}
              alt={entry.mood}
              className="w-50 h-50 lg:w-80 lg:h-80 m-auto"
              width={320}
              height={320}
            />
        </p>
        <div className="mt-8 md:max-w-[180px] md:absolute md:bottom-8 md:left-8 xl:max-w-[250px]">
          <img
            src={quoteIcon}
            alt="quotation mark"
            className="w-6 h-6 block m-auto md:ml-0"
            width={24}
            height={24}
          />
          <p className="text-[18px]/[1.3] mt-3 italic">&ldquo;{quote}&rdquo;</p>
        </div>
      </div>
    </div>
  );
};

export default TodayMoodSummary;
