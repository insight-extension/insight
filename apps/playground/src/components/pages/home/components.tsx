// apps/playground/src/components/pages/home/components.tsx
import { Button, Card, HStack, Text, VStack } from "@chakra-ui/react";

import { Icon } from "../../ui/icons/base";
import type { IconName } from "../../ui/icons/base";
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

interface InfoCardProps {
  title: string;
  value: string;
  valueLabel: string;
  iconName: IconName;
}

export const InfoCard = ({
  title,
  value,
  valueLabel,
  iconName,
}: InfoCardProps) => (
  <Card.Root variant="elevated" size="sm" width="146px">
    <Card.Body gap={2}>
      <HStack justify="space-between" align="center">
        <Text
          fontFamily="Satoshi"
          fontWeight="500"
          color="text.primary"
          fontSize="sm"
        >
          {title}
        </Text>
        <Icon name={iconName} size={16} />
      </HStack>
      <VStack
        bg="bg.cardAlt"
        borderRadius="md"
        p={2}
        align="flex-start"
        gap={1}
      >
        <Text
          fontFamily="Satoshi"
          fontWeight="700"
          color="text.primary"
          fontSize="lg"
        >
          {value}
        </Text>
        <Text
          fontFamily="Satoshi"
          fontWeight="500"
          color="text.secondary"
          fontSize="xs"
        >
          {valueLabel}
        </Text>
      </VStack>
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
