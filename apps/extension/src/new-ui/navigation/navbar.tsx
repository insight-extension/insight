import { Box, HStack, IconButton } from "@chakra-ui/react";
import * as LucideIcons from "lucide-react";

import { NavigationManager } from "./manager";

// Navigation items config
const NAVIGATION_ITEMS = [
  {
    title: "Home Page",
    gradient: "linear-gradient(130deg, #5433ff 0%, #20bdff 100%)",
    route: NavigationManager.paths.home as keyof typeof NavigationManager.paths,
    icon: LucideIcons.Home,
    isHome: true
  },
  {
    title: "Transactions History Page",
    route: NavigationManager.paths
      .transactions as keyof typeof NavigationManager.paths,
    icon: LucideIcons.RefreshCcw
  },
  {
    title: "Translations History Page",
    route: NavigationManager.paths
      .translations as keyof typeof NavigationManager.paths,
    icon: LucideIcons.Languages
  },
  {
    title: "Settings Page",
    route: NavigationManager.paths
      .settings as keyof typeof NavigationManager.paths,
    icon: LucideIcons.Settings
  }
];

export const Navbar = ({
  onNavigate
}: {
  onNavigate?: (route: string) => void;
}) => (
  <HStack
    borderRadius="100px"
    background="#010103"
    p={2}
    gap={6}
    align="center"
    w="full"
    justify="space-between"
  >
    {NAVIGATION_ITEMS.map((item) => {
      const IconComponent = item.icon;
      return (
        <Box
          key={item.title}
          borderRadius="full"
          background={item.gradient || "transparent"}
          width="42px"
          height="42px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <IconButton
            aria-label={item.title}
            variant="ghost"
            background="transparent"
            borderRadius="full"
            minW="unset"
            w="42px"
            h="42px"
            onClick={() => {
              if (onNavigate) {
                onNavigate(item.route);
              } else {
                // Default: open tab page (except home)
                if (item.isHome) {
                  window.open("/", "_self");
                } else {
                  const url = chrome.runtime.getURL(
                    NavigationManager.getURL(item.route)
                  );
                  window.open(url, "_blank");
                }
              }
            }}
            _hover={{
              bg: item.gradient ? item.gradient : "#18181b"
            }}
            tabIndex={0}
          >
            <IconComponent
              width="20px"
              height="20px"
              color={item.gradient ? "#fff" : "#CDCDCD"}
            />
          </IconButton>
        </Box>
      );
    })}
  </HStack>
);
