/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx,js}"],
  prefix: "",
  theme: {
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
          300: "#121212",
          400: "#0E0E0E"
        },
        white: {
          DEFAULT: "#FBFFFC",
          100: "#CDCDCDCC",
          200: "#B1B5BF",
          300: "#F3F3F5"
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
        green: {
          300: "#20BDFF",
          400: "#3FB300"
        }
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
