import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      colors: {
        space: {
          void: "#000000",
          deep: "#050505",
          panel: "#0a0a12",
        },
        lab: {
          white: "#FFFFFF",
          mist: "#F8F9FA",
          grid: "#E8ECF0",
        },
        neon: {
          cyan: "#22d3ee",
          blue: "#3b82f6",
          green: "#4ade80",
        },
        intel: {
          royal: "#1d4ed8",
          emerald: "#059669",
          crimson: "#dc2626",
        },
      },
      boxShadow: {
        "neon-cyan": "0 0 24px rgba(34, 211, 238, 0.45), 0 0 48px rgba(34, 211, 238, 0.15)",
        "neon-green": "0 0 24px rgba(74, 222, 128, 0.4)",
        "lab-crisp": "0 8px 32px rgba(15, 23, 42, 0.12), 0 2px 8px rgba(15, 23, 42, 0.06)",
        "lab-gloss": "inset 0 1px 0 rgba(255,255,255,0.9), 0 12px 40px rgba(29, 78, 216, 0.08)",
      },
      animation: {
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
        "spin-slow": "spin 12s linear infinite",
        "scan-line": "scan-line 2s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6", filter: "brightness(1)" },
          "50%": { opacity: "1", filter: "brightness(1.25)" },
        },
        "scan-line": {
          "0%": { top: "0%", opacity: "0.3" },
          "50%": { opacity: "1" },
          "100%": { top: "100%", opacity: "0.3" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
