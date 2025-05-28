import {
  IconButton as ChakraIconButton,
  IconButtonProps,
  RecipeVariantProps,
  useRecipe,
} from "@chakra-ui/react";
import React from "react";

import { iconButtonRecipe } from "./recipe";

type IconButtonVariantProps = RecipeVariantProps<typeof iconButtonRecipe> &
  IconButtonProps & {
    ref?: React.Ref<HTMLButtonElement>;
  };

export const IconButton = (props: IconButtonVariantProps) => {
  const { visual, size, ...restProps } = props;

  const recipe = useRecipe({ recipe: iconButtonRecipe });
  const styles = recipe({ visual, size });

  return <ChakraIconButton css={styles} {...restProps} />;
};
