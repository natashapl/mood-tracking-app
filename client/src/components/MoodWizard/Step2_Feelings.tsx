import { useRef, useState } from "react";
import CustomCheckbox from "../CustomCheckbox";
import hintIcon from "../../assets/images/icon-hint.svg"

interface Step2FeelingsProps {
  feelings: string[];
  onChange: (updated: string[]) => void;
  maxSelections?: number;
}

const feelingOptions = [
  "Joyful", "Down", "Anxious", "Calm", "Excited",
  "Frustrated", "Lonely", "Grateful", "Overwhelmed", "Motivated",
  "Irritable", "Peaceful", "Tired", "Hopeful", "Confident",
  "Stressed", "Content", "Disappointed", "Optimistic", "Restless",
];

const Step2_Feelings = ({ feelings, onChange, maxSelections = 3 }: Step2FeelingsProps) => {

  const [tooManySelected, setTooManySelected] = useState(false);

  const handleToggle = (feeling: string) => {
    const exists = feelings.includes(feeling);

    let updated: string[];
    if (exists) {
      updated = feelings.filter((f) => f !== feeling);
      setTooManySelected(false);
    } else {
      if (feelings.length >= maxSelections) {
        setTooManySelected(true);
        return;
      } else {
        updated = [...feelings, feeling];
        setTooManySelected(false);
      }
    }

    onChange(updated);
  };

  const errorRef = useRef<HTMLDivElement>(null);

  return (
    <div className="step step2">
      <h2 className="font-bold text-[28px]/[1.3] md:text-[32px]/[1.4] mb-1.5">How did you feel?</h2>
      <p className="text-mood-neutral-600 text-[18px]/[1.2] mb-6 md:mb-8">Select up to {maxSelections} tags:</p>
      <div className="flex flex-wrap gap-3 mb-4">
        {feelingOptions.map((feeling) => {
          const isSelected = feelings.includes(feeling);
          const disabled = !isSelected && feelings.length >= maxSelections;

          return (
            <CustomCheckbox
              key={feeling}
              label={feeling}
              checked={isSelected}
              disabled={disabled}
              onChange={() => handleToggle(feeling)}
            />
          );
        })}
      </div>

      {tooManySelected && (
        <div ref={errorRef} className="flex items-start gap-2 text-[15px]/[1.4] mt-2">
          <img
            src={hintIcon}
            alt="error"
            className="w-4 h-4 mt-0.5 inline-flex object-contain"
            width="16"
            height="16"
          />
          <span>You can only select a maximum of {maxSelections} tags.</span>
        </div>
      )}    
    </div>
  );
};

export default Step2_Feelings;
