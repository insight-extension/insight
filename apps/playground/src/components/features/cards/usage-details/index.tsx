import {
  Card,
  HStack,
  Heading,
  Text,
  VStack,
  useToken,
} from "@chakra-ui/react";

import { Icon, IconName } from "@/components/ui";

interface UsageDetailsCardProps {
  title: string;
  value: string;
  valueLabel: string;
  iconName: IconName;
}

export const UsageDetailsCard = ({
  title,
  value,
  valueLabel,
  iconName,
}: UsageDetailsCardProps) => {
  const [iconColor] = useToken("colors", ["text.primary"]);

  return (
    <Card.Root
      variant="elevated"
      background="background.app"
      width="full"
      fontFamily="Satoshi-Variable"
    >
      <Card.Body gap={2} padding={1}>
        <HStack justify="space-between" align="center" padding={1.5}>
          <Heading
            as="h4"
            fontWeight="500"
            color="text.primary"
            fontSize="sm"
            lineHeight="100%"
          >
            {title}
          </Heading>

          <Icon name={iconName} color={iconColor} size={16} />
        </HStack>

        <VStack
          borderRadius="xl"
          paddingX={2.5}
          paddingY={2}
          gap={2}
          color="text.primary"
          background="background.elevated"
          align="start"
          lineHeight="100%"
          minW="140px"
        >
          <Text fontSize="xss">{valueLabel}</Text>

          <Text fontWeight="500" fontSize="xs">
            {value}
          </Text>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};
