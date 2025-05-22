import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const uiConfig = defineConfig({
  theme: {
    tokens: {
      fonts: {
        // Satoshi-Light (300)
        // Satoshi-Regular (400)
        // Satoshi-Medium (500)
        // Satoshi-Bold (700)
        // Satoshi-Black (900)
        body: { value: "Satoshi-Variable" },
        heading: { value: "Satoshi-Variable" },
        mono: { value: "Satoshi-Variable" },
      },
      colors: {
        // semantic colors
        primary: { value: "#348BFF" },
        gradient: {
          value: "linear-gradient(130deg, #5433ff 0%, #20bdff 100%)",
        },
        background: {
          app: { value: "#0E0E0E" },
          surface: { value: "#010103" },
          elevated: { value: "#121212" },
          translation: { value: "#0A1A30" },
        },
        text: {
          primary: { value: "rgba(205, 205, 205, 0.8)" },
          secondary: { value: "rgba(205, 205, 205, 0.7)" },
        },
        border: {
          default: { value: "#262628" },
        },
      },
      spacing: {
        container: { value: "4" },
        card: { value: "3" },
      },
      sizes: {
        container: { value: "320px" },
        icon: {
          sm: { value: "4" },
          md: { value: "5" },
          lg: { value: "6" },
        },
      },
      radii: {
        container: { value: "xl" },
        card: { value: "lg" },
        button: { value: "md" },
      },
    },
    recipes: {
      Card: {
        base: {
          bg: "background.surface",
          borderRadius: "card",
          p: "card",
        },
        // variants: {
        //   info: {
        //     display: "flex",
        //     flexDirection: "column",
        //     gap: 2
        //   },
        //   translation: {
        //     bg: "background.translation",
        //     p: "container"
        //   }
        // }
      },
      Button: {
        base: {
          borderRadius: "button",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        // variants: {
        //   primary: {
        //     bg: "primary",
        //     color: "background.surface",
        //     _hover: { opacity: 0.9 }
        //   },
        //   ghost: {
        //     bg: "transparent",
        //     _hover: { bg: "background.elevated" }
        //   }
        // }
      },
    },
  },
  globalCss: {
    "html, body": {
      bg: "bg.dark",
      color: "text.primary",
    },
  },
});

export const uiSystem = createSystem(defaultConfig, uiConfig);

export type SystemTokens = typeof uiSystem.tokens;
