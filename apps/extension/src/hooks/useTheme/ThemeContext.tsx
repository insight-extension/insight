import { ReactNode, createContext, useEffect, useState } from "react";

export type Theme = "dark" | "light";

type ThemeContextProps = {
  theme: Theme;
  setLightTheme: () => void;
  setDarkTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  setLightTheme: () => {},
  setDarkTheme: () => {}
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("light");

  const setLightTheme = () => {
    localStorage.theme = "light";
    document.documentElement.classList.remove("dark");
    setTheme("light");
  };

  const setDarkTheme = () => {
    localStorage.theme = "dark";
    document.documentElement.classList.add("dark");
    setTheme("dark");
  };

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setDarkTheme();
    } else {
      setLightTheme();
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setLightTheme, setDarkTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
