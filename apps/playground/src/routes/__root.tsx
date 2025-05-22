import { Box, Heading, VStack } from "@chakra-ui/react";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

const APP_SIZE = {
  width: "320px",
  height: "720px",
};

function RootComponent() {
  return (
    <VStack w="100vw" pt={20} alignItems="center" justifyContent="center">
      <Box {...APP_SIZE}>
        <Outlet />
      </Box>
    </VStack>
  );
}
