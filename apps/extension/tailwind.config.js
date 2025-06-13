/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx,js}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px"
      }
    },
    extend: {
      colors: {
        blue: {
          100: "#E9F2FF",
          200: "#20BDFF",
          300: "#348BFF",
          400: "#5433FF",
          500: "#5433FF",
          600: "#0A1A30"
        },
        dark: {
          DEFAULT: "#0A0B0A",
          100: "#010103",
          200: "#1C2020",
          300: "#121212"
        },
        white: {
          DEFAULT: "#FBFFFC",
          100: "#CDCDCDCC",
          200: "#B1B5BF"
        },
        grey: {
          200: "#F8F9FD",
          300: "#EEF0FA",
          400: "#4F4F4F",
          500: "#262628",
          600: "#999999"
        },
        red: {
          400: "#EB4132"
        },
        slate: {
          600: "#D9D9D9",
          700: "#898989"
        },
        green: {
          300: "#20BDFF",
          400: "#3FB300"
        },
        purple: {
          300: "#515CEC"
        },
        // todo: remove and reuse common theme
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          dark: "hsl(var(--secondary-dark))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out"
      },
      fontFamily: {
        satoshi: ["Satoshi", "sans-serif"]
      },
      width: {
        38: "9.5rem",
        84: "21rem"
      },
      fontSize: {
        md: "1rem"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};
