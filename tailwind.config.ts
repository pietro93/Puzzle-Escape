import type { Config } from "tailwindcss"
const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        pixel: ["PixelFont", "monospace"],
        medieval: ["var(--font-medieval)", "serif"],
        parchment: ["var(--font-parchment)", "serif"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-4px)" },
          "40%": { transform: "translateX(4px)" },
          "60%": { transform: "translateX(-4px)" },
          "80%": { transform: "translateX(4px)" },
        },
        clack: {
          "0%, 100%": { transform: "translateY(0)" },
          "33%": { transform: "translateY(-6px) scaleY(1.06)" },
          "66%": { transform: "translateY(2px)" },
        },
        // Rat lands in its new cell: small hop plus a wiggle
        hopWiggle: {
          "0%, 100%": { transform: "translateY(0) rotate(0) scale(1)" },
          "20%": { transform: "translateY(-6px) rotate(-9deg) scale(1.15)" },
          "45%": { transform: "translateY(-3px) rotate(8deg) scale(1.08)" },
          "70%": { transform: "translateY(0) rotate(-5deg) scale(1)" },
          "85%": { transform: "rotate(3deg)" },
        },
        pop: {
          "0%": { transform: "scale(0.92)" },
          "55%": { transform: "scale(1.06)" },
          "100%": { transform: "scale(1)" },
        },
        rattle: {
          "0%, 100%": { transform: "rotate(0) translateY(0)" },
          "15%": { transform: "rotate(-4deg) translateY(-2px)" },
          "30%": { transform: "rotate(4deg)" },
          "45%": { transform: "rotate(-3deg) translateY(-1px)" },
          "60%": { transform: "rotate(3deg)" },
          "75%": { transform: "rotate(-1deg)" },
        },
        squash: {
          "0%": { transform: "scaleY(1)" },
          "35%": { transform: "scaleY(0.9)" },
          "70%": { transform: "scaleY(1.05)" },
          "100%": { transform: "scaleY(1)" },
        },
        // Level 41: a solved route reveals left to right, then smoulders
        wipeIn: {
          "0%": { clipPath: "inset(0 100% 0 0)" },
          "100%": { clipPath: "inset(0 0 0 0)" },
        },
        fireGlow: {
          "0%, 100%": { filter: "drop-shadow(0 0 2px rgba(249,115,22,0.5))", opacity: "1" },
          "30%": { filter: "drop-shadow(0 0 6px rgba(249,115,22,0.9))", opacity: "0.85" },
          "55%": { opacity: "1" },
          "75%": { filter: "drop-shadow(0 0 3px rgba(250,204,21,0.8))", opacity: "0.9" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.012, 1.022)" },
        },
        goldFleck: {
          "0%": { transform: "translate(0, 0) scale(1)", opacity: "1" },
          "100%": { transform: "translate(var(--tx), var(--ty)) scale(0.3)", opacity: "0" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out forwards",
        shake: "shake 0.4s ease-in-out",
        clack: "clack 0.45s steps(3)",
        breathe: "breathe 3.4s ease-in-out infinite",
        hopWiggle: "hopWiggle 0.55s ease-out",
        pop: "pop 0.35s ease-out",
        fireRoute: "wipeIn 0.7s ease-out both, fireGlow 1.8s 0.7s ease-in-out infinite",
        rattle: "rattle 0.5s ease-in-out",
        squash: "squash 0.3s ease-out",
        goldFleck: "goldFleck 550ms ease-out forwards",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
