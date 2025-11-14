/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // EXISTING COLORS (kept)
        primary: '#2E8B57',        // Sea Green
        secondary: '#228B22',
        accent: '#FFD700',

        // NEW CUSTOM PALETTE
        burgundy: "#7A1E1E",
        olive: "#808000",
        "scarlet-red": "#FF2400",
        "mustard-yellow": "#E1AD01",
        "mustard-blue": "#4B86B4",

        // OPTIONAL SHADES FOR DEPTH (UI glow, hover, dark mode)
        "burgundy-light": "#9E2A2A",
        "burgundy-dark": "#5C1717",

        "olive-light": "#A3A35A",
        "olive-dark": "#666600",

        "scarlet-red-dark": "#CC1D00",

        "mustard-yellow-dark": "#B88A00",

        "mustard-blue-dark": "#3A6D8E",
      },
    },
  },
  plugins: [],
  
  // Dark mode support
  darkMode: 'class',
};
