/** @type {import('tailwindcss').Config} */
module.exports = {
  // Ensure we cover all directories for NativeWind scanning
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // AAA Accessibility Compliant Palette
        primary: {
          DEFAULT: "#4FD1C7", // Soft Teal
          glass: "rgba(79, 209, 199, 0.15)",
          border: "rgba(79, 209, 199, 0.3)",
        },
        secondary: {
          DEFAULT: "#B794F6", // Muted Lavender
          glass: "rgba(183, 148, 246, 0.15)",
        },
        tertiary: {
          DEFAULT: "#9AE6B4", // Warm Sage (Success)
        },
        neutral: {
          50: "#F7FAFC",
          100: "#EDF2F7",
          200: "#CBD5E0",
          800: "#1E293B",
          900: "#0F172A",
          950: "#201a36", // Obsidian Base
        },
      },
      // Custom Glassmorphism Blur Intensities
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      },
      // Animation for AI Sparkles and UI Transitions
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [
    // Plugin to handle specific Glassmorphism Utilities
    function ({ addUtilities }) {
      addUtilities({
        '.glass-main': {
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          borderColor: 'rgba(255, 255, 255, 0.08)',
          borderWidth: '1px',
        },
        '.glass-teal': {
          backgroundColor: 'rgba(79, 209, 199, 0.05)',
          borderColor: 'rgba(79, 209, 199, 0.1)',
          borderWidth: '1px',
        },
        '.glass-lavender': {
          backgroundColor: 'rgba(183, 148, 246, 0.05)',
          borderColor: 'rgba(183, 148, 246, 0.1)',
          borderWidth: '1px',
        }
      });
    },
  ],
};