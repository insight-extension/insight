import * as React from "react";

import type {
  SpanProps,
  SwitchControlProps,
  SwitchRootProps
} from "@chakra-ui/react";
import { Span, Switch } from "@chakra-ui/react";
import { ThemeProvider, useTheme } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

import { Icon } from "@/new-ui/ui/icons";

export interface ColorModeProviderProps extends ThemeProviderProps {}

export function ColorModeProvider(props: ColorModeProviderProps) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
  );
}

export type ColorMode = "light" | "dark";

export interface UseColorModeReturn {
  colorMode: ColorMode;
  setColorMode: (colorMode: ColorMode) => void;
  toggleColorMode: () => void;
}

export function useColorMode(): UseColorModeReturn {
  const { resolvedTheme, setTheme } = useTheme();
  const toggleColorMode = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };
  return {
    colorMode: resolvedTheme as ColorMode,
    setColorMode: setTheme,
    toggleColorMode
  };
}

export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? dark : light;
}

export function ColorModeIcon() {
  const { colorMode } = useColorMode();

  return colorMode === "dark" ? (
    <Icon name="Moon" size="20px" />
  ) : (
    <Icon name="Sun" size="20px" />
  );
}

interface ColorModeSwitchProps {
  controlProps?: SwitchControlProps;
  rootProps?: SwitchRootProps;
}

export const ColorModeSwitch = ({
  controlProps,
  rootProps
}: ColorModeSwitchProps) => {
  const { toggleColorMode } = useColorMode();

  return (
    <Switch.Root {...rootProps} onCheckedChange={toggleColorMode}>
      <Switch.HiddenInput />
      <Switch.Control {...controlProps}>
        <Switch.Thumb>
          <Switch.ThumbIndicator fallback={<Icon name="Sun" />}>
            <Icon name="Moon" />
          </Switch.ThumbIndicator>
        </Switch.Thumb>

        <Switch.Indicator fallback={<Icon name="Moon" />}>
          <Icon name="Sun" />
        </Switch.Indicator>
      </Switch.Control>
    </Switch.Root>
  );
};

export const LightMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function LightMode(props, ref) {
    return (
      <Span
        color="fg"
        display="contents"
        className="chakra-theme light"
        colorPalette="gray"
        colorScheme="light"
        ref={ref}
        {...props}
      />
    );
  }
);

export const DarkMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function DarkMode(props, ref) {
    return (
      <Span
        color="fg"
        display="contents"
        className="chakra-theme dark"
        colorPalette="gray"
        colorScheme="dark"
        ref={ref}
        {...props}
      />
    );
  }
);
