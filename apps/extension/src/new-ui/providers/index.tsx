import { Provider as ChakraProvider } from "@/new-ui/ui/provider";

export const withAppProviders = (Component: React.FC) => (
  <ChakraProvider>
    <Component />
  </ChakraProvider>
);
