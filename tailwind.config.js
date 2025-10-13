/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  theme: {
    extend: {
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
      },
      colors: {
        "dark-bg": "#0F0A1E",
        "dark-card": "#1A132A",
        "dark-border": "#2A1F3C",
        "dark-primary": "#8B5CF6",
        "dark-primary-hover": "#7C3AED",
        "dark-text": "#E4E4E7",
        "dark-text-muted": "#A1A1AA",
        "dark-success": "#10B981",
        "dark-danger": "#EF4444",
      },
    },
  },
  plugins: [],
};
