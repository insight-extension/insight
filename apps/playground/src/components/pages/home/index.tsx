// apps/playground/src/components/pages/home/index.tsx
import { Box, Container, HStack, IconButton, VStack } from "@chakra-ui/react";

import { Icon } from "../../ui/icons/lucide";
import {
  ConnectWalletButton,
  InfoCard,
  LanguageSelector,
  TranslationCard,
} from "./components";

export const HomePage = () => {
  return (
    <Container bg="background.app" p={0}>
      <VStack gap={4}>
        {/* Header */}
        <Box as="header" w="full" bg="gradient" p={4}>
          <HStack justify="space-between">
            <Box />
            <HStack gap={2}>
              <IconButton aria-label="Toggle theme" variant="ghost">
                <Icon name="Sun" size={24} />
              </IconButton>
              <IconButton aria-label="Close panel" variant="ghost">
                <Icon name="PanelRightClose" size={24} />
              </IconButton>
            </HStack>
          </HStack>
        </Box>

        {/* Main Content */}
        <VStack as="main" gap={4} w="full">
          <HStack w="full" gap={4}>
            <InfoCard
              title="Free Trial"
              valueLabel="Next Free Time in"
              value="30.04.2025, 23:22:11"
              iconName="Info"
            />
            <InfoCard
              title="Usage Info"
              valueLabel="Balance"
              value="44.56 USDT"
              iconName="Info"
            />
          </HStack>

          <ConnectWalletButton />
          <LanguageSelector activeLanguage="English" />

          <VStack gap={4} w="full">
            <TranslationCard
              text="Lorem ipsum dolor sit amet..."
              language="English"
            />
            <TranslationCard
              text="Lorem ipsum dolor sit amet..."
              language="Ukrainian"
            />
          </VStack>
        </VStack>
      </VStack>
    </Container>
  );
};
