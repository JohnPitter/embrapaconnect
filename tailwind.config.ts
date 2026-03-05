import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-base": "#1A1F0F",
        "dark-green": "#1E2A14",
        "mid-green": "#4A5C2E",
        "light-muted": "#C8D5B0",
        "off-white": "#F0F4E8",
        "lime-accent": "#C6E832",
        "tag-bg": "#2E3B1E",
        "tag-text": "#C8D5B0",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
