// src/assets/moodImages.ts

import verySad from "./images/icon-very-sad-white.svg";
import sad from "./images/icon-sad-white.svg";
import neutral from "./images/icon-neutral-white.svg";
import happy from "./images/icon-happy-white.svg";
import veryHappy from "./images/icon-very-happy-white.svg";

const moodImages: Record<"Very Sad" | "Sad" | "Neutral" | "Happy" | "Very Happy", string> = {
  "Very Sad": verySad,
  "Sad": sad,
  "Neutral": neutral,
  "Happy": happy,
  "Very Happy": veryHappy,
};

export default moodImages;
