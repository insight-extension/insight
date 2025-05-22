import { ChakraProvider } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

import { ColorModeProvider } from "@/components/ui";

import { uiSystem } from "./theme";

export const Provider = ({ children }: PropsWithChildren) => (
  <ChakraProvider value={uiSystem}>
    <ColorModeProvider />

    {children}
  </ChakraProvider>
);
