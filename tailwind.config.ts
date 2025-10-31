import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFF5DC",
        gist: {
          white: "rgba(255, 255, 255, 0.60)",
          yellow: "rgba(254, 255, 205, 0.60)",
        },
        gradient: {
          from: "#8072FA",
          to: "#A678D1",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
