import { defineRecipe } from "@chakra-ui/react";

export const iconButtonRecipe = defineRecipe({
  variants: {
    size: {
      sm: { minWidth: 30, minHeight: 30, width: 30, height: 30 },
    },
    visual: {
      solid: { borderRadius: "full", bg: "background.app" },
    },
  },
  defaultVariants: {
    size: "sm",
    visual: "solid",
  },
});
