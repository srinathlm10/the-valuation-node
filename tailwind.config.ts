import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // NOTE: the default Tailwind slate scale is used as-is (an earlier
        // override mapped shades to partially-undefined CSS vars, silently
        // breaking classes like bg-slate-400). Do not re-add an override here.
        emerald: {
          DEFAULT: "hsl(var(--emerald))",
          light: "hsl(var(--emerald-light))",
          dark: "hsl(var(--emerald-dark))",
        },
        amber: {
          DEFAULT: "hsl(var(--amber))",
          light: "hsl(var(--amber-light))",
          dark: "hsl(var(--amber-dark))",
        },
        rose: {
          DEFAULT: "hsl(var(--rose))",
          light: "hsl(var(--rose-light))",
        },
        hero: {
          heading: "hsl(var(--hero-heading))",
          subtext: "hsl(var(--hero-subtext))",
        },
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        // UI, navigation, headings: modern sans
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        // Article and Foundations body: refined reading serif
        serif: ["Source Serif 4", "Georgia", "Cambria", "serif"],
        // Legacy aliases kept so existing font-display/font-heading classes resolve
        display: ["Inter", "system-ui", "sans-serif"],
        heading: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        // Soft, slate-tinted elevation scale (centralised; overrides defaults)
        sm: "0 1px 2px 0 hsl(220 25% 15% / 0.05)",
        DEFAULT: "0 1px 3px 0 hsl(220 25% 15% / 0.07), 0 1px 2px -1px hsl(220 25% 15% / 0.06)",
        md: "0 4px 10px -2px hsl(220 25% 15% / 0.08), 0 2px 4px -2px hsl(220 25% 15% / 0.05)",
        lg: "0 12px 24px -6px hsl(220 25% 15% / 0.12), 0 4px 8px -4px hsl(220 25% 15% / 0.06)",
        xl: "0 20px 36px -10px hsl(220 25% 15% / 0.16), 0 8px 14px -6px hsl(220 25% 15% / 0.08)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(100%)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-out-right": {
          from: { opacity: "1", transform: "translateX(0)" },
          to: { opacity: "0", transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-up": "slide-up 0.5s ease-out forwards",
        "slide-in-right": "slide-in-right 0.3s ease-out forwards",
        "slide-out-right": "slide-out-right 0.3s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
