import { Box, HStack, useToken } from "@chakra-ui/react";

import { IconButton } from "@/app/recipes/icon-button";
import { ColorModeButton } from "@/components/ui";
import { Icon, Logo } from "@/components/ui/icons";

export const Header = () => {
  const [iconSize] = useToken("sizes", "icon.sm");

  return (
    <Box as="header" bg="gradient" w="full" p={3} h={220}>
      <HStack justify="space-between">
        <Logo />

        <HStack gap={2}>
          <ColorModeButton />

          <IconButton size="sm" variant="solid" color="secondary">
            <Icon name="PanelRightClose" size={iconSize} />
          </IconButton>

          <IconButton size="sm" variant="solid" color="secondary">
            <Icon name="X" size={iconSize} />
          </IconButton>
        </HStack>
      </HStack>
    </Box>
  );
};
