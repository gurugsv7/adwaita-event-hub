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
        // Custom ADWAITA colors
        gold: "hsl(var(--gold))",
        silver: "hsl(var(--silver))",
        charcoal: "hsl(var(--charcoal))",
        teal: "hsl(var(--teal))",
        orange: "hsl(var(--orange))",
        purple: {
          deep: "hsl(var(--purple-deep))",
        },
        // Concert page futuristic colors
        concert: {
          deep: "#1A1A2E",
          purple: "#2D1B4E",
          "purple-light": "#3D2862",
          pink: "#FF1B9F",
          cyan: "#00FFD9",
          gold: "#FFD700",
          surface: "#1A1A2E",
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
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
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "portal-pulse": {
          "0%, 100%": { opacity: "0.8", boxShadow: "0 0 60px hsl(45,70%,53%,0.4), inset 0 0 60px hsl(45,70%,53%,0.2)" },
          "50%": { opacity: "1", boxShadow: "0 0 100px hsl(45,70%,53%,0.6), inset 0 0 80px hsl(45,70%,53%,0.3)" },
        },
        "portal-breathe": {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.08)" },
        },
        "ripple-1": {
          "0%": { opacity: "0.4", transform: "scale(0.9)" },
          "50%": { opacity: "0.2", transform: "scale(1)" },
          "100%": { opacity: "0.4", transform: "scale(0.9)" },
        },
        "ripple-2": {
          "0%": { opacity: "0.3", transform: "scale(0.95)" },
          "50%": { opacity: "0.15", transform: "scale(1.02)" },
          "100%": { opacity: "0.3", transform: "scale(0.95)" },
        },
        "ripple-3": {
          "0%": { opacity: "0.2", transform: "scale(1)" },
          "50%": { opacity: "0.1", transform: "scale(1.03)" },
          "100%": { opacity: "0.2", transform: "scale(1)" },
        },
        "float-rune": {
          "0%, 100%": { opacity: "0.3", transform: "translateY(0) rotate(0deg)" },
          "50%": { opacity: "0.6", transform: "translateY(-20px) rotate(10deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.5)" },
        },
        "wisp-1": {
          "0%, 100%": { opacity: "0", strokeDashoffset: "100" },
          "50%": { opacity: "1", strokeDashoffset: "0" },
        },
        "wisp-2": {
          "0%, 100%": { opacity: "0", strokeDashoffset: "-100" },
          "50%": { opacity: "0.8", strokeDashoffset: "0" },
        },
        "wisp-3": {
          "0%, 100%": { opacity: "0", strokeDashoffset: "80" },
          "50%": { opacity: "0.6", strokeDashoffset: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "spin-slow": "spin-slow 30s linear infinite",
        "portal-pulse": "portal-pulse 4s ease-in-out infinite",
        "portal-breathe": "portal-breathe 6s ease-in-out infinite",
        "ripple-1": "ripple-1 5s ease-in-out infinite",
        "ripple-2": "ripple-2 6s ease-in-out infinite 0.5s",
        "ripple-3": "ripple-3 7s ease-in-out infinite 1s",
        "float-rune": "float-rune 5s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "wisp-1": "wisp-1 8s ease-in-out infinite",
        "wisp-2": "wisp-2 10s ease-in-out infinite 2s",
        "wisp-3": "wisp-3 9s ease-in-out infinite 4s",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
