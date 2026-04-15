import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', "sans-serif"],
      },
      colors: {
        primary: "var(--primary)",
        "primary-mid": "var(--primary-mid)",
        accent: "var(--accent)",
      },
      keyframes: {
        ddDown: {
          "0%": { opacity: "0", transform: "translateY(-6px) scale(0.97)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "dd-down": "ddDown .16s ease both",
        "fade-in": "fadeIn .2s ease both",
        "scale-in": "scaleIn .22s cubic-bezier(.34,1.56,.64,1) both",
        "slide-up": "slideUp .4s ease both",
      },
    },
  },
  plugins: [],
} satisfies Config;
