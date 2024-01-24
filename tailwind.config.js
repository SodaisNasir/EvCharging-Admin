/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: "Poppins",
        mont: "Montserrat",
        emoji: "Noto Color Emoji",
      },
      colors: {
        primary: {
          100: "#a1daaa",
          200: "#8ed298",
          300: "#68c376",
          400: "#55bc65",
          500: "#42b454",
          600: "#3ba24c",
          700: "#359043",
          800: "#2e7e3b",
          900: "#286c32",
        },
      },
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
  },
  plugins: [],
};
