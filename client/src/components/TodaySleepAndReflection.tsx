import type { MoodEntry } from "../types";
import sleepIcon from "../assets/images/icon-sleep.svg";
import reflectionIcon from "../assets/images/icon-reflection.svg"

const TodaySleepAndReflection = ({ entry }: { entry: MoodEntry }) => {
  return (
    <div className="sleep-reflection-summary space-y-5">

      {/* Sleep */}
      <div className="bg-white rounded-2xl border border-mood-blue-100 p-5 space-y-4">
        <h3 className="flex items-center gap-3 text-[18px]/[1.2] font-medium text-mood-neutral-600">
          <img
            src={sleepIcon}
            alt="sleep icon"
            className="w-[22px] h-[22px]"
            width={22}
            height={22}
          />
          <span>Sleep</span>
        </h3>
        <p className="text-[32px]/[1.4] font-bold">{entry.sleepRange}</p>
      </div>

      {/* Reflection */}
      <div className="bg-white rounded-2xl border border-mood-blue-100 p-5 space-y-4 min-h-[196px] h-full relative">
        <h3 className="flex items-center gap-3 text-[18px]/[1.2] font-medium text-mood-neutral-600">
          <img
            src={reflectionIcon}
            alt="reflection icon"
            className="w-[22px] h-[22px]"
            width={22}
            height={22}
          />
          <span>Reflection of the day</span>
        </h3>
        <p className="text-[18px]/[1.2] font-medium">{entry.reflection || "No reflection entered."}</p>
        <ul className="flex flex-wrap gap-3 md:absolute md:bottom-5 md:left-5">
          {entry.feelings.map((feeling, idx) => (
            <li
              key={idx}
              className="text-[18px]/[1.3] italic"
            >
              #{feeling}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodaySleepAndReflection;
