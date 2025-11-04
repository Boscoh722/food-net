/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2E8B57',   // Sea Green (Kenyan agriculture theme)
        secondary: '#228B22',
        accent: '#FFD700',
      },
    },
  },
  plugins: [],
  darkMode: 'class', // Enable dark mode
}
