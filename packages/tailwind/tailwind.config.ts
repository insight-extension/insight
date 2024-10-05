import type { Config } from "tailwindcss";

import typography from "@tailwindcss/typography";
import daisyui from "daisyui";

export const config: Config = {
  content: ["../../packages/ui/src/components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["var(--font-zen-dots)"],
      },
    },
  },
  daisyui: {
    themes: ["synthwave"],
  },
  plugins: [daisyui, typography],
};
