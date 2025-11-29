/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        deepTeal: "#0b3c4a",
        midTeal: "#138a9c",
        accentTeal: "#21b6c5",
        lightBg: "#f5fcff",
      },
    },
  },
  plugins: [],
};

