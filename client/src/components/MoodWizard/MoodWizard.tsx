import { useRef, useState } from "react";
import Step1_Mood from "./Step1_Mood";
import Step2_Feelings from "./Step2_Feelings";
import Step3_Reflection from "./Step3_Reflection";
import Step4_Sleep from "./Step4_Sleep";
import type { MoodEntry } from "../../types";
import { saveMoodEntryToSupabase } from "../../utils/supabaseStorage";
import { getLocalDateString } from "../../utils/date";
import closeIcon from "../../assets/images/icon-close.svg"
import hintIcon from "../../assets/images/icon-hint.svg"

type MoodLevel = -2 | -1 | 0 | 1 | 2;

type MoodEntryDraft = {
  mood: MoodLevel | null;
  feelings: string[];
  reflection: string;
  sleepRange: string | null;
};

const moodLevelMap: Record<MoodLevel, MoodEntry["mood"]> = {
  [-2]: "Very Sad",
  [-1]: "Sad",
  [0]: "Neutral",
  [1]: "Happy",
  [2]: "Very Happy",
};

const reverseMoodMap: Record<MoodEntry["mood"], MoodLevel> = {
  "Very Sad": -2,
  "Sad": -1,
  "Neutral": 0,
  "Happy": 1,
  "Very Happy": 2,
};

const MoodWizard = ({
  onClose,
  refreshEntries,
  existingEntry,
}: {
  onClose: () => void;
  refreshEntries?: () => void;
  existingEntry?: MoodEntry;
}) => {

  const [step, setStep] = useState(1);
  const [showError, setShowError] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<MoodEntryDraft>({
    mood: existingEntry ? reverseMoodMap[existingEntry.mood] : null,
    feelings: existingEntry ? existingEntry.feelings : [],
    reflection: existingEntry ? existingEntry.reflection : "",
    sleepRange: existingEntry ? existingEntry.sleepRange : null,
  });


  const handleContinue = async () => {
    if (!isStepValid()) {
      setShowError(true);
      setTimeout(() => {
        errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return;
    }

    setShowError(false);

    if (step < 4) {
      setStep(step + 1);
      setTimeout(() => {
        contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    } else {
      if (formData.mood === null || !formData.sleepRange) {
        console.error("Missing mood or sleep range");
        return;
      }

      // Build the entry object (works for both new and update)
      const entry: MoodEntry = {
        id: existingEntry?.id || Date.now().toString(),
        date: getLocalDateString(),
        mood: moodLevelMap[formData.mood],
        feelings: formData.feelings,
        reflection: formData.reflection.trim(),
        sleepRange: formData.sleepRange as MoodEntry["sleepRange"],
      };

      // Save to Supabase (handles both insert and update)
      const { success, error } = await saveMoodEntryToSupabase(entry);

      if (!success) {
        console.error('Error saving entry:', error);
        alert('Failed to save entry. Please try again.');
        return;
      }

      // Call refreshEntries before closing to update parent state
      await refreshEntries?.();

      // Close the wizard
      onClose();
    }
  };

  const isStepValid = () => {
    if (step === 1) return formData.mood !== null;
    if (step === 2) return formData.feelings.length > 0;
    if (step === 3) return formData.reflection.trim().length > 0;
    if (step === 4) return formData.sleepRange !== null;
    return true;
  };

  const handleClose = () => {
    onClose(); // cancel the wizard entirely
  };

  return (
    <div className="flex items-center justify-center fixed w-full top-0 left-0 right-0 z-60">
      <div className="bg-gradient-to-b from-[#f5f5ff] from-73% to-[#e0e0ff] z-50 rounded-xl shadow-lg w-5/6 max-w-[600px] min-w-[335px] relative top-10">

        
        <div className="pt-8 px-5 md:pt-12 md:px-10">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-8 right-8 cursor-pointer">
            <img
              src={closeIcon}
              alt="close"
              className="w-[15px] h-[15px] object-contain"
              width="15"
              height="15"
            />
          </button>
          <h2 className="text-[32px]/[1.4] md:text-[40px]/[1.2] font-bold mb-6 md:mb-8">
            {existingEntry ? "Edit your mood" : "Log your mood"}
          </h2>

          {/* Progress Bar */}
          <div className="flex justify-between items-center gap-4 mb-6 md:mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1.5 rounded-full ${
                  step >= s ? "bg-mood-blue-600" : "bg-mood-blue-200"
                }`}
              />
            ))}
          </div>  
        </div>
     
        {/* Step Content */}
        <div ref={contentRef} className="step-container px-5 md:px-10 overflow-y-auto max-h-[65vh]">
          {step === 1 && (
            <>
              <Step1_Mood
                mood={formData.mood}
                onSelect={(value) => setFormData({ ...formData, mood: value })}
              /> 
              {showError && !formData.mood && (
                <div ref={errorRef} className="flex items-start gap-2 text-mood-red-700 text-[15px]/[1.4] mt-2">
                  <img
                    src={hintIcon}
                    alt="error"
                    className="w-4 h-4 mt-0.5 inline-flex object-contain"
                    width="16"
                    height="16"
                  />
                  <span>Please select a mood before continuing.</span>
                </div>
              )}          
            </>


          )}

          {step === 2 && (
            <>
              <Step2_Feelings
                feelings={formData.feelings}
                onChange={(updated) => setFormData({ ...formData, feelings: updated })}
              />           
              {showError && formData.feelings.length < 1 && (
                <div ref={errorRef} className="flex items-start gap-2 text-mood-red-700 text-[15px]/[1.4] mt-2">
                  <img
                    src={hintIcon}
                    alt="error"
                    className="w-4 h-4 mt-0.5 inline-flex object-contain"
                    width="16"
                    height="16"
                  />
                  <span>Please select at least one tag to describe your mood.</span>
                </div>
              )}             
            </>

          )}

          {step === 3 && (
            <>
              <Step3_Reflection
                value={formData.reflection}
                onChange={(value) => setFormData({ ...formData, reflection: value })}
              /> 
              {showError && !formData.reflection && (
                <div ref={errorRef} className="flex items-start gap-2 text-[15px]/[1.4] mt-2">
                  <img
                    src={hintIcon}
                    alt="error"
                    className="w-4 h-4 mt-0.5 inline-flex object-contain"
                    width="16"
                    height="16"
                  />
                  <span>Please write a few words about your day before continuing.</span>
                </div>
              )}             
            </>

          )}

          {step === 4 && (
            <>
              <Step4_Sleep
                value={formData.sleepRange}
                onChange={(val) => {
                  setFormData({ ...formData, sleepRange: val });
                  setShowError(false);
                }}
              />
              {showError && !formData.sleepRange && (
                <div ref={errorRef} className="flex items-start gap-2 text-mood-red-700 text-[15px]/[1.4] mt-2">
                  <img
                    src={hintIcon}
                    alt="error"
                    className="w-4 h-4 mt-0.5 inline-flex object-contain"
                    width="16"
                    height="16"
                  />
                  <span>Please select how many hours you slept last night.</span>
                </div>
              )}
            </>
          )}

        </div>
        <div className="pt-4 pb-8 px-5 md:px-10 ">
          {/* Navigation Button */}
          <button
            onClick={handleContinue}
            className={`w-full py-4 px-8 rounded-[10px] text-[24px]/[140%] transition ${
              isStepValid()
                ? "bg-mood-blue-600 text-white hover:bg-mood-blue-700 cursor-pointer"
                : "bg-gray-300 text-gray-500"
            }`}
          >
            {step < 4 ? "Continue" : "Complete entry"}
          </button>          
        </div>
      </div>
      <div 
        onClick={handleClose}
        className="overlay w-full h-full fixed inset-0 z-40 bg-mood-neutral-900 opacity-70 cursor-pointer">
      </div>
    </div>
  );
};

export default MoodWizard;