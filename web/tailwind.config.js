/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          primary: "#0a0c10",
          secondary: "#12151c",
          accent: "#1a1e26",
        },
        accent: {
          cyan: "#00f2ff",
          green: "#00ff88",
          blue: "#3b82f6",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        outfit: ["Outfit", "sans-serif"],
      },
      animation: {
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(0, 242, 255, 0.2)" },
          "50%": { boxShadow: "0 0 20px rgba(0, 242, 255, 0.5)" },
        },
      },
    },
  },
  plugins: [],
};
