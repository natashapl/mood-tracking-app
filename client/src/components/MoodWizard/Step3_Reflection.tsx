interface Step3ReflectionProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

const Step3_Reflection = ({ value, onChange, maxLength = 150 }: Step3ReflectionProps) => {

  return (
    <div className="step step3 mb-4">
      <h2 className="font-bold text-[28px]/[1.3] md:text-[32px]/[1.4] mb-6 md:mb-8">Write about your day...</h2>

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= maxLength) {
              onChange(e.target.value);
            }
          }}
          placeholder="Today, I felt..."
          className="w-full h-36 px-4 py-3 bg-white border border-mood-neutral-300 rounded-[10px] text-[18px]/[1.3] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="text-right text-xs text-gray-500 mt-1">
          {value.length}/{maxLength}
        </div>
      </div>
      
    </div>
  );
};

export default Step3_Reflection;
