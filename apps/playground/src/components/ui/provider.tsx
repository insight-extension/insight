import { ChakraProvider } from "@chakra-ui/react";

import { uiSystem } from "@/app/theme";

import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

export const StyleSystemProvider = (props: ColorModeProviderProps) => {
  return (
    <ChakraProvider value={uiSystem}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
};
