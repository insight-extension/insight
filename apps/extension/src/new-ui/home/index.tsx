import { Box, HStack, Icon, Text, VStack } from "@chakra-ui/react";

// types
type Language = "English" | "Ukrainian";

interface HomeProps {
  // add props if needed
}

// constants
const GRADIENT_BG = "linear-gradient(130deg, #5433ff 0%, #20bdff 100%)";
const COLORS = {
  background: {
    dark: "#0E0E0E",
    card: "#010103",
    blue: "#348BFF",
    text: {
      primary: "rgba(205, 205, 205, 0.8)",
      secondary: "rgba(205, 205, 205, 0.7)"
    }
  }
} as const;

const SIZES = {
  container: {
    width: "320px",
    height: "726px"
  },
  header: {
    height: "229px"
  }
} as const;

// components
const LanguageSelector = ({ activeLanguage }: { activeLanguage: Language }) => (
  <HStack justify="flex-start" align="center" gap="0px">
    <VStack
      borderRadius="20px"
      borderColor="#262628"
      borderWidth="1px"
      width="133px"
      height="30px"
    >
      <HStack justify="flex-start" align="center">
        <VStack width="12px" height="12px">
          <Box />
        </VStack>
        <Text
          fontFamily="Satoshi"
          fontWeight="500"
          fontSize="14px"
          color={COLORS.background.text.primary}
        >
          English
        </Text>
      </HStack>
    </VStack>
    <VStack
      borderRadius="20px"
      borderColor="#EEF0FA"
      borderWidth="1px"
      width="30px"
      height="30px"
    />
    <VStack
      borderRadius="20px"
      borderColor="#262628"
      borderWidth="1px"
      width="133px"
      height="30px"
    >
      <HStack justify="flex-start" align="center">
        <VStack width="12px" height="12px" />
        <Text
          fontFamily="Satoshi"
          fontWeight="500"
          fontSize="14px"
          color={COLORS.background.text.primary}
        >
          Ukrainian
        </Text>
      </HStack>
    </VStack>
  </HStack>
);

const TranslationCard = ({
  text,
  language
}: {
  text: string;
  language: Language;
}) => (
  <VStack
    borderRadius="17px"
    width="312px"
    height="143px"
    maxWidth="100%"
    background="#0A1A30"
  >
    <Text
      fontFamily="Satoshi"
      lineHeight="1.2"
      fontWeight="400"
      fontSize="14px"
      color="#CDCDCD"
      width="282px"
      maxWidth="100%"
    >
      {text}
    </Text>
    <HStack justify="flex-start" align="center">
      <VStack width="16px" height="16px" />
      <Text
        fontFamily="Satoshi"
        fontWeight="400"
        fontSize="12px"
        color={COLORS.background.text.secondary}
      >
        {language}
      </Text>
    </HStack>
    <Box>
      <Box
        borderRadius="4px"
        width="3px"
        height="27px"
        background={COLORS.background.card}
      />
    </Box>
  </VStack>
);

export const Home = ({}: HomeProps) => {
  return (
    <VStack
      bg="red"
      width={SIZES.container.width}
      height={SIZES.container.height}
      maxWidth="100%"
      background={COLORS.background.dark}
    >
      {/* header content */}
      <Box as="header">
        <VStack width="74px" height="22px" />

        <HStack justify="flex-start" align="center" gap="4px">
          <VStack
            borderRadius="36px"
            width="84px"
            height="30px"
            background={COLORS.background.card}
          >
            <HStack
              justify="space-between"
              align="center"
              gap="0px"
              width="80px"
            >
              <VStack borderRadius="26px" width="40px" height="26px">
                <VStack width="16px" height="16px" />
              </VStack>
              <VStack
                borderRadius="26px"
                width="40px"
                height="26px"
                background={COLORS.background.blue}
              >
                <VStack width="14px" height="14px" />
              </VStack>
            </HStack>
          </VStack>
          <VStack
            borderRadius="36px"
            width="30px"
            height="30px"
            background={COLORS.background.card}
          >
            <VStack width="20px" height="20px" />
          </VStack>
          <VStack
            borderRadius="36px"
            width="30px"
            height="30px"
            background={COLORS.background.card}
          >
            <VStack width="20px" height="20px" />
          </VStack>
        </HStack>
      </Box>

      {/* main content */}
      <VStack
        as="main"
        justify="flex-start"
        align="flex-start"
        width="296px"
        maxWidth="100%"
      >
        <LanguageSelector activeLanguage="English" />
        <Box>
          <TranslationCard
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            language="English"
          />
          <TranslationCard
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            language="Ukrainian"
          />
        </Box>
      </VStack>

      {/* footer */}
      {/* <VStack
        as="footer"
        borderRadius="17px"
        width={SIZES.container.width}
        height="427px"
        maxWidth="100%"
        background={COLORS.background.card}
      >
        <VStack
          borderRadius="20px"
          width="296px"
          height="39px"
          maxWidth="100%"
          background={COLORS.background.blue}
        >
          <Text
            fontFamily="Satoshi"
            fontWeight="500"
            fontSize="16px"
            color={COLORS.background.card}
            textAlign="center"
          >
            Start
          </Text>
        </VStack>

        <HStack justify="flex-start" align="center" gap="12px">
          <Text
            fontFamily="Satoshi"
            fontWeight="500"
            fontSize="12px"
            color={COLORS.background.text.secondary}
          >
            Follow us
          </Text>
          <HStack justify="flex-start" align="center" gap="16px">
            <VStack color="Original" width="16px" height="16px">
              Telegram
            </VStack>
            <Icon />
          </HStack>
        </HStack>
      </VStack> */}
    </VStack>
  );
};
