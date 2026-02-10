interface Step4SleepProps {
  value: string | null;
  onChange: (value: string) => void;
}

const sleepOptions = [
  "9+ hours",
  "7-8 hours",
  "5-6 hours",
  "3-4 hours",
  "0-2 hours",
];

const Step4_Sleep = ({ value, onChange }: Step4SleepProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">How many hours did you sleep last night?</h2>

      <div role="radiogroup" aria-label="Sleep range" className="space-y-3 mb-4">
        {sleepOptions.map((option) => {
          const isSelected = value === option;

          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => onChange(option)}
              className={`
                flex items-center justify-between w-full p-4 rounded-xl border-2 transition cursor-pointer hover:border-mood-blue-600
                ${isSelected
                    ? "border-mood-blue-600"
                    : "border-mood-blue-100"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full  ${
                    isSelected ? "border-[5px] border-mood-blue-600" : "border-2 border-mood-blue-200"
                  }`}
                />
                <span className="text-[20px]/[1.4] font-semibold">{option}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Step4_Sleep;
