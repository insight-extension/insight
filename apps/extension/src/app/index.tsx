import { type FC, useCallback, useEffect } from "react";
import InstaIcon from "react:@/assets/instagram.svg";
import LinkedinIcon from "react:@/assets/linkedin.svg";
import XIcon from "react:@/assets/x.svg";

import { cn } from "@repo/ui/lib";

import { AppContextProvider, useAppContext } from "@/app/AppContext";
import {
  HomePage,
  SettingsPage,
  TransactionsPage,
  TranslationsPage
} from "@/components/pages";
import { Footer, Header, WalletInfo } from "@/components/widgets";
import "@/global.css";
import { ThemeProvider } from "@/hooks/useTheme/ThemeContext";

// todo: add env WSS var for manifest
//    "content_security_policy": {
//       "extension_pages": "script-src 'self'; connect-src 'self' wss://$ENV_VAR:*;"
//     }

interface AppProps {
  width: "sidebar" | "popup";
  isSidebar: boolean;
}

const AppMain: FC<AppProps> = ({ isSidebar, width }) => {
  const { setIsSidebar, currentPage, publicKey, accessToken } = useAppContext();

  const getCurrentPage = useCallback(() => {
    switch (currentPage) {
      case "home":
        return <HomePage />;
      case "creditCard":
        return <TransactionsPage />;
      case "translate":
        return <TranslationsPage />;
      case "settings":
        return <SettingsPage />;
    }
  }, [currentPage]);

  useEffect(() => {
    setIsSidebar(isSidebar);
  }, [isSidebar, setIsSidebar]);

  if (!publicKey) {
    return (
      <div
        className={cn(
          width === "sidebar" ? "w-90 min-h-screen max-h-screen" : "w-84 min-h-[500px] max-h-[500px]",
          "h-full flex flex-col bg-gradient-to-r from-blue-400 dark:from-blue-500 dark:to-blue-200 to-green-300"
        )}
      >
        <div className="grow flex flex-col">
          <Header />
          <div className="grow flex justify-center items-center flex-col px-3 gap-4">
            <h1 className="text-2xl font-medium text-white dark:text-dark-100 text-center">
              To Start The Extension - Connect Your Wallet
            </h1>
            <div className="w-full">
              <WalletInfo accessToken={accessToken} publicKey={publicKey} />
            </div>
          </div>
        </div>
        <div className="gap-4 flex shrink-0 items-center p-3 dark:bg-dark-100 bg-white rounded-t-[17px]">
          <div className="text-dark-200 dark:text-white-100 text-xs font-medium">
            Follow us
          </div>
          <a
            href="https://www.linkedin.com/company/insight-xyz/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedinIcon className="w-4 h-4 text-blue-300 dark:text-blue-300/65" />
          </a>
          <a
            href="https://www.instagram.com/insight.xyz/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstaIcon className="w-4 h-4 text-blue-300 dark:text-blue-300/65" />
          </a>
          <a
            href="https://x.com/insight_xyz"
            target="_blank"
            rel="noopener noreferrer"
          >
            <XIcon className="w-4 h-4 text-blue-300 dark:text-blue-300/65" />
          </a>
        </div>
      </div>
    );
  }
  return (
    <div
      className={cn(
        width === "sidebar"
          ? "w-90 min-h-screen max-h-screen"
          : "w-84 min-h-[600px] max-h-[600px]",
        "h-full flex flex-col"
      )}
    >
      <Header />

      <div className={cn("grow flex h-full", isSidebar && "overflow-hidden items-stretch")}>
        <div className="w-full flex flex-col dark:bg-dark-100 bg-white rounded-[17px] py-3 px-1">
          <div className={cn("w-full grow flex flex-col", isSidebar && "overflow-hidden")}>
            {getCurrentPage()}
          </div>
          <div className="flex justify-between items-center pt-3 px-2">
            <div className="gap-4 flex shrink-0 items-center">
              <div className="text-dark-200 dark:text-white-100 text-xs font-medium">
                Follow us
              </div>
              <a
                href="https://www.linkedin.com/company/insight-xyz/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedinIcon className="w-4 h-4 text-blue-300 dark:text-blue-300/65" />
              </a>
              <a
                href="https://www.instagram.com/insight.xyz/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstaIcon className="w-4 h-4 text-blue-300 dark:text-blue-300/65" />
              </a>
              <a
                href="https://x.com/insight_xyz"
                target="_blank"
                rel="noopener noreferrer"
              >
                <XIcon className="w-4 h-4 text-blue-300 dark:text-blue-300/65" />
              </a>
            </div>
            <div className="flex items-center gap-2">
              <label
                htmlFor="switch-link"
                className="antialiased cursor-pointer text-sm dark:text-white-100 text-dark-200"
              >
                Dubbing
              </label>
              <input
                id="switch-link"
                type="checkbox"
                className="group appearance-none relative inline-block rounded-full w-9 h-[18px] cursor-pointer before:inline-block before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-full before:bg-stone-200 before:transition-colors before:duration-200 before:ease-in after:absolute after:top-2/4 after:left-0 after:-translate-y-2/4 after:w-[18px] after:h-[18px] after:border after:border-stone-200 after:bg-white after:rounded-full checked:after:translate-x-full after:transition-all after:duration-200 after:ease-in disabled:opacity-50 disabled:cursor-not-allowed dark:after:bg-white checked:before:bg-stone-800 checked:after:border-stone-800"
                disabled
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export const App: FC<AppProps> = ({ isSidebar, width }) => {
  return (
    <AppContextProvider>
      <ThemeProvider>
        <AppMain isSidebar={isSidebar} width={width} />
      </ThemeProvider>
    </AppContextProvider>
  );
};
