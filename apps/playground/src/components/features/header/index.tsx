import { HStack, VStack, useToken } from "@chakra-ui/react";

import { IconButton } from "@/app/recipes/icon-button";
import { UsageDetailsCard } from "@/components/features/cards";
import { ColorModeButton } from "@/components/ui";
import { Icon, Logo } from "@/components/ui/icons";

export const Header = () => {
  const [iconSize] = useToken("sizes", "icon.sm");

  return (
    <VStack
      as="header"
      bg="gradient"
      w="full"
      p={1}
      h={220}
      align="center"
      justify="space-between"
    >
      <HStack w="full" justify="space-between" align="center">
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

      <HStack w="full" gap={1}>
        <UsageDetailsCard
          title="Free Trial"
          valueLabel="Next Free Time in"
          value="30.04.2025, 23:22:11"
          iconName="Info"
        />

        <UsageDetailsCard
          title="Usage Info"
          valueLabel="Balance"
          value="44.56 USDT"
          iconName="Info"
        />
      </HStack>
    </VStack>
  );
};
