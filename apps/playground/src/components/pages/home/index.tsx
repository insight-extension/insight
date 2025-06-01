// apps/playground/src/components/pages/home/index.tsx
import { Container, VStack } from "@chakra-ui/react";

import { Header } from "@/components/features";

import {
  ConnectWalletButton,
  LanguageSelector,
  TranslationCard,
} from "./components";

export const HomePage = () => {
  return (
    <Container bg="background.app" p={0}>
      <VStack gap={4}>
        <Header />

        <VStack as="main" gap={4} w="full">
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
