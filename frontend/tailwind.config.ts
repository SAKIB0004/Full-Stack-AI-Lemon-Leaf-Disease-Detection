import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        grove: {
          50:  "#f0faf0",
          100: "#dcf5dc",
          200: "#b8eab9",
          300: "#86d688",
          400: "#52ba55",
          500: "#2e9e32",
          600: "#1f7f23",
          700: "#1a641d",
          800: "#19501b",
          900: "#164219",
          950: "#072409",
        },
        stone: {
          50:  "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
          950: "#0c0a09",
        },
        amber: {
          400: "#fbbf24",
          500: "#f59e0b",
        },
        rose: {
          400: "#fb7185",
          500: "#f43f5e",
        }
      },
      animation: {
        "fade-up":    "fadeUp 0.6s ease forwards",
        "fade-in":    "fadeIn 0.4s ease forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "spin-slow":  "spin 2s linear infinite",
        "bar-grow":   "barGrow 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards",
        "shimmer":    "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeUp:   { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        fadeIn:   { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        barGrow:  { "0%": { width: "0%" }, "100%": { width: "var(--bar-width)" } },
        shimmer:  { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
      backgroundImage: {
        "grove-radial": "radial-gradient(ellipse at top left, #dcf5dc 0%, transparent 60%)",
        "amber-radial": "radial-gradient(ellipse at bottom right, #fef3c7 0%, transparent 60%)",
      },
      boxShadow: {
        "grove-sm": "0 1px 3px 0 rgb(46 158 50 / 0.12), 0 1px 2px -1px rgb(46 158 50 / 0.08)",
        "grove-md": "0 4px 16px -2px rgb(46 158 50 / 0.18), 0 2px 6px -2px rgb(46 158 50 / 0.10)",
        "grove-lg": "0 16px 40px -4px rgb(46 158 50 / 0.22), 0 6px 16px -4px rgb(46 158 50 / 0.12)",
        "card":     "0 2px 8px 0 rgb(0 0 0 / 0.06), 0 1px 2px 0 rgb(0 0 0 / 0.04)",
        "card-lg":  "0 8px 32px 0 rgb(0 0 0 / 0.08), 0 2px 8px 0 rgb(0 0 0 / 0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
