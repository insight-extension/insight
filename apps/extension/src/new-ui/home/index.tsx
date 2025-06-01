import { Box, HStack, IconButton, Stack, Text, VStack } from "@chakra-ui/react";

import {
  ColorModeSwitch,
  Icon,
  InstagramIcon,
  LinkedInIcon,
  TelegramIcon,
  XIcon
} from "@/new-ui/ui";

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

// constants for card sizes and colors
const CARD_WIDTH = "146px";
const CARD_HEIGHT = "79px";
const CARD_BG = COLORS.background.card;
const CARD_INNER_BG = "#121212";
const CARD_RADIUS = "17px";
const CARD_INNER_RADIUS = "11px";
const CONNECT_BTN_RADIUS = "17px";
const CONNECT_BTN_BG = COLORS.background.card;
const CONNECT_BTN_HEIGHT = "39px";
const CONNECT_BTN_ICON_BG = COLORS.background.blue;
const CONNECT_BTN_ICON_SIZE = "31px";
const CONNECT_BTN_ICON_RADIUS = "52.04px";
const CONNECT_BTN_TEXT_COLOR = COLORS.background.text.primary;
const CONNECT_BTN_FONT_SIZE = "16px";
const CONNECT_BTN_FONT_WEIGHT = 500;
const CONNECT_BTN_ICON_LEFT = {
  name: "Wallet",
  color: COLORS.background.blue,
  size: 20
};
const CONNECT_BTN_ICON_RIGHT = {
  name: "ChevronRight",
  color: COLORS.background.text.primary,
  size: 20
};

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

    <IconButton size="sm" variant="ghost" background={COLORS.background.card}>
      <Icon name="RefreshCcw" width="20px" height="20px" />
    </IconButton>

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

// reusable card component
const InfoCard = ({
  title,
  valueLabel,
  value,
  iconName
}: {
  title: string;
  valueLabel: string;
  value: string;
  iconName: string;
}) => (
  <VStack
    borderRadius={CARD_RADIUS}
    width={CARD_WIDTH}
    height={CARD_HEIGHT}
    background={CARD_BG}
    gap={1}
    align="flex-start"
    justify="flex-start"
    px={3}
    py={2}
  >
    <HStack w="100%" justify="space-between" align="center">
      <Text
        fontFamily="Satoshi"
        fontWeight={500}
        fontSize="14px"
        color={COLORS.background.text.primary}
        truncate
      >
        {title}
      </Text>
      <Icon
        name={iconName as any}
        width="16px"
        height="16px"
        color={COLORS.background.text.primary}
      />
    </HStack>
    <VStack
      borderRadius={CARD_INNER_RADIUS}
      width="100%"
      height="41px"
      background={CARD_INNER_BG}
      align="flex-start"
      justify="center"
      px={3}
      gap={0}
    >
      <Text
        fontFamily="Satoshi"
        fontWeight={400}
        fontSize="11px"
        color={COLORS.background.text.secondary}
      >
        {valueLabel}
      </Text>
      <Text
        fontFamily="Satoshi"
        fontWeight={500}
        fontSize="12px"
        color={COLORS.background.text.primary}
      >
        {value}
      </Text>
    </VStack>
  </VStack>
);

// connect wallet button
const ConnectWalletButton = () => (
  <HStack
    as="button"
    borderRadius={CONNECT_BTN_RADIUS}
    height={CONNECT_BTN_HEIGHT}
    w="100%"
    background={CONNECT_BTN_BG}
    justify="center"
    align="center"
    gap={3}
    px={4}
    cursor="pointer"
    _hover={{ background: "#18181b" }}
  >
    <Box
      borderRadius={CONNECT_BTN_ICON_RADIUS}
      width={CONNECT_BTN_ICON_SIZE}
      height={CONNECT_BTN_ICON_SIZE}
      background={CONNECT_BTN_ICON_BG}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Icon name="Wallet" color="#fff" width="20px" height="20px" />
    </Box>
    <Text
      fontFamily="Satoshi"
      fontWeight={CONNECT_BTN_FONT_WEIGHT}
      fontSize={CONNECT_BTN_FONT_SIZE}
      color={CONNECT_BTN_TEXT_COLOR}
      flex={1}
      textAlign="center"
    >
      Connect Wallet
    </Text>
    <HStack gap={0}>
      <Icon
        name="ChevronRight"
        color={CONNECT_BTN_TEXT_COLOR}
        width="20px"
        height="20px"
      />
      <Icon
        name="ChevronRight"
        color={CONNECT_BTN_TEXT_COLOR}
        width="20px"
        height="20px"
      />
    </HStack>
  </HStack>
);

export const Home = ({}: HomeProps) => {
  return (
    <VStack
      width={SIZES.container.width}
      height={SIZES.container.height}
      background={COLORS.background.dark}
    >
      {/* header content */}
      <HStack
        justify="space-between"
        align="center"
        as="header"
        background={GRADIENT_BG}
        width="100%"
      >
        <VStack width="74px" height="22px" />

        <HStack justify="flex-start" align="center" gap="4px">
          <VStack background={COLORS.background.card}>
            <ColorModeSwitch />
          </VStack>

          <IconButton
            size="sm"
            borderRadius="50%"
            background={COLORS.background.card}
          >
            <Icon name="PanelRightClose" width="20px" height="20px" />
          </IconButton>

          <IconButton
            size="sm"
            borderRadius="50%"
            background={COLORS.background.card}
          >
            <Icon name="X" width="20px" height="20px" />
          </IconButton>
        </HStack>
      </HStack>

      {/* main content */}
      <VStack
        as="main"
        justify="flex-start"
        align="flex-start"
        width="296px"
        maxWidth="100%"
      >
        <HStack w="100%" gap={4} align="flex-start">
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
        <Stack
          borderRadius="20px"
          width="296px"
          height="30px"
          maxWidth="100%"
          background="#010103"
        >
          <Stack direction="row" justify="flex-start" align="center">
            <Stack width="14px" height="14px">
              <Box>
                <Box
                  borderRadius="56px"
                  width="14px"
                  height="14px"
                  background="linear-gradient(130deg, #5433ff 0%, #20bdff 100%)"
                />
                <Box
                  borderRadius="28px"
                  width="7px"
                  height="7px"
                  background="m"
                />
              </Box>
            </Stack>
            <Text
              fontFamily="Satoshi"
              fontWeight="500"
              fontSize="14px"
              color="#348BFF"
            >
              Connected
            </Text>
          </Stack>
        </Stack>

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
      <VStack
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
              <TelegramIcon />
            </VStack>
            <VStack color="Original" width="16px" height="16px">
              <XIcon />
            </VStack>
            <VStack color="Original" width="16px" height="16px">
              <LinkedInIcon />
            </VStack>
            <VStack color="Original" width="16px" height="16px">
              <InstagramIcon />
            </VStack>
          </HStack>
        </HStack>
      </VStack>
    </VStack>
  );
};
