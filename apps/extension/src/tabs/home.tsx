import { useState } from "react";

import { Box, VStack } from "@chakra-ui/react";

import { Navbar, NavigationManager } from "@/new-ui/navigation";

export default function PageWithNavbar() {
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);

  const handleNavigate = (route: string) => {
    if (route === "home") {
      setIframeSrc(null); // Show home content
    } else {
      const url = chrome.runtime.getURL(
        `tabs${NavigationManager.paths[route as keyof typeof NavigationManager.paths]}.html`
      );
      setIframeSrc(url);
    }
  };

  return (
    <VStack w="100%" h="100%" spacing={4} align="stretch">
      <Navbar onNavigate={handleNavigate} />

      {iframeSrc ? (
        <Box
          as="iframe"
          width="100%"
          height="400px"
          border="none"
          src={iframeSrc}
          allow="camera; microphone"
        />
      ) : (
        <Box p={8} textAlign="center" color="white">
          Welcome Home!
        </Box>
      )}
    </VStack>
  );
}
