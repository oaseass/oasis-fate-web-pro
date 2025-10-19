/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#070b14",
        card: "rgba(14, 20, 32, 0.6)",
        border: "rgba(255,255,255,0.08)",
        accent: "#6ae3ff"
      },
      boxShadow: {
        glass: "0 10px 30px rgba(0,0,0,0.35)"
      },
      backdropBlur: {
        xs: "2px"
      }
    }
  },
  plugins: []
};
