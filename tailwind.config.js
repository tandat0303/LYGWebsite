/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
      },
      colors: {
        primary: "#0f2544",
        "primary-mid": "#1a3a6e",
        "primary-light": "#e8edf5",
        accent: "#2563eb",
        "accent-hover": "#1d4ed8",
      },
      animation: {
        fadeSlideUp: "fadeSlideUp 0.5s ease both",
        langDown: "langDown 0.18s cubic-bezier(0.22,1,0.36,1) both",
        fadeIn: "fadeIn 0.3s ease both",
      },
      keyframes: {
        fadeSlideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        langDown: {
          from: { opacity: "0", transform: "translateY(-8px) scale(0.97)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      backdropBlur: {
        "2xl": "40px",
        "3xl": "64px",
      },
    },
  },
  plugins: [],
};
