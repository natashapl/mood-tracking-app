// src/assets/moodImagesColor.ts

import verySad from "./images/icon-very-sad-color.svg";
import sad from "./images/icon-sad-color.svg";
import neutral from "./images/icon-neutral-color.svg";
import happy from "./images/icon-happy-color.svg";
import veryHappy from "./images/icon-very-happy-color.svg";

const moodImagesColor: Record<"Very Sad" | "Sad" | "Neutral" | "Happy" | "Very Happy", string> = {
  "Very Sad": verySad,
  "Sad": sad,
  "Neutral": neutral,
  "Happy": happy,
  "Very Happy": veryHappy,
};

export default moodImagesColor;
