"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/** @type {import('tailwindcss').Config} */
var _default = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Reddit Sans"', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
};
exports["default"] = _default;