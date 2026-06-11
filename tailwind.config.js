/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#07182f",
        "navy-light": "#10294d",
        "navy-mid": "#10213d",
        gold: "#c9a227",
        "gold-light": "#e2c766",
        "gold-muted": "#a8861f",
        surface: "#f8fafc",
      },
    },
  },
  plugins: [],
};