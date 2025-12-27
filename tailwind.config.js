/** @type {import('tailwindcss').Config} */
module.exports = {
  // Ensure this covers all your high-fidelity components
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#4FD1C7",
        secondary: "#B794F6",
      },
    },
  },
  plugins: [],
};