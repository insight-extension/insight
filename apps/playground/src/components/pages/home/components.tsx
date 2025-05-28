import { Button, Card, HStack, Text } from "@chakra-ui/react";

import { Icon } from "../../ui/icons/base";
import { Language } from "./types";

export const LanguageSelector = ({
  activeLanguage,
}: {
  activeLanguage: Language;
}) => (
  <HStack gap={0}>
    <Button variant="ghost" p={4} borderRadius="button">
      <HStack>
        <Icon name="Globe" size={16} />
        <Text>{activeLanguage}</Text>
      </HStack>
    </Button>
  </HStack>
);

export const TranslationCard = ({
  text,
  language,
}: {
  text: string;
  language: Language;
}) => (
  <Card.Root variant="elevated">
    <Card.Body>
      <Text fontSize="md" lineHeight="tall">
        {text}
      </Text>
      <HStack>
        <Icon name="Globe" size={16} />
        <Text fontSize="sm" color="text.secondary">
          {language}
        </Text>
      </HStack>
    </Card.Body>
  </Card.Root>
);

export const ConnectWalletButton = () => (
  <Button variant="outline" bg="bg.card" borderRadius="xl" height="39px">
    <HStack gap={2}>
      <Icon name="Wallet" size={20} />
      <Text color="text.primary">Connected</Text>
      <Icon name="ChevronRight" size={20} />
    </HStack>
  </Button>
);
