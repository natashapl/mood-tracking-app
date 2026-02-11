import veryLow from "../../assets/images/icon-very-sad-color.svg";
import low from "../../assets/images/icon-sad-color.svg";
import neutral from "../../assets/images/icon-neutral-color.svg";
import good from "../../assets/images/icon-happy-color.svg";
import great from "../../assets/images/icon-very-happy-color.svg";

type MoodLevel = -2 | -1 | 0 | 1 | 2;

const moodOptions: { value: MoodLevel; label: string; image: string }[] = [
  { value: 2, label: "Very Happy", image: great },
  { value: 1, label: "Happy", image: good },
  { value: 0, label: "Neutral", image: neutral },
  { value: -1, label: "Sad", image: low },
  { value: -2, label: "Very Sad", image: veryLow },
];

interface Step1Props {
  mood: MoodLevel | null;
  onSelect: (value: MoodLevel) => void;
}

const Step1_Mood = ({ mood, onSelect }: Step1Props) => {
  return (
    <div className="step step1 mb-8">
      <h2 className="font-bold text-[28px]/[1.3] md:text-[32px]/[1.4] mb-6 md:mb-8">How was your mood today?</h2>

      <div className="space-y-3" role="radiogroup" aria-label="Select your mood">
        {moodOptions.map((option) => {
          const isSelected = mood === option.value;

          return (
            <button
              role="radio"
              aria-checked={isSelected}
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
              className={`flex items-center justify-between w-full p-4 rounded-xl border-2 transition cursor-pointer hover:border-mood-blue-600 bg-white
                ${
                  isSelected
                    ? "border-mood-blue-600"
                    : "border-mood-blue-100"
                }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full  ${
                    isSelected ? "border-[5px] border-mood-blue-600" : "border-2 border-mood-blue-200"
                  }`}
                />
                <span className="text-[20px]/[1.4] font-semibold">{option.label}</span>
              </div>

              <img
                src={option.image}
                alt={option.label}
                className="w-8 h-8 object-contain"
                width="32"
                height="32"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Step1_Mood;
