import type { Config } from "tailwindcss";

// Token map (DESIGN.md → Tailwind key):
//   --bg-base       → page
//   --bg-subtle     → panel
//   --text-primary  → ink
//   --text-muted    → muted
//   --text-subtle   → subtle
//   --border        → line
//   --border-strong → line-strong
//   --accent-blue   → accent-blue
//   --accent-pink   → accent-pink

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        page: "#FFFFFF",
        panel: "#FAFAFA",
        ink: "#0A0A0A",
        muted: "#595959",
        subtle: "#8E8E8E",
        line: "#EDEDED",
        "line-strong": "#D4D4D4",
        "accent-blue": "#6B9BD2",
        "accent-pink": "#E8A5B7",
      },
      fontFamily: {
        sans: [
          "var(--font-pretendard)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        display: [
          "var(--font-schibsted-grotesk)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "var(--font-jetbrains-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      letterSpacing: {
        display: "-0.02em",
      },
      transitionTimingFunction: {
        "out-quart": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
      maxWidth: {
        prose: "896px",
      },
    },
  },
  plugins: [],
};

export default config;
