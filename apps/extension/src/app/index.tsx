import { type FC, useCallback, useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";

import {
  ChevronsUpDown,
  CircleX,
  Languages,
  Play,
  Sidebar,
  Square
} from "lucide-react";

import { Component } from "@repo/shared/component";
import { SessionToken, SubscriptionType } from "@repo/shared/constants";

import { storage } from "@/background";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { TextBlock } from "@/components/ui/textBlock";
import { ConnectionStatus, StorageKey } from "@/constants";
import "@/global.css";
import { useAudioRecord, useExtensionControls } from "@/hooks";
import { type Language } from "@/types";
import { constructURLWithParams } from "@/utils";

console.log("Component", Component);
console.log("Button", Button);

// todo: add env WSS var for manifest
//    "content_security_policy": {
//       "extension_pages": "script-src 'self'; connect-src 'self' wss://$ENV_VAR:*;"
//     }

// List of supported languages
const supportedLanguages: Language[] = [
  { name: "English", flagCode: "US" },
  { name: "Українська", flagCode: "UA" },
  { name: "Français", flagCode: "FR" }
  // Add other languages if necessary
];

interface AppProps {
  isSidebar: boolean;
}

export const App: FC<AppProps> = ({ isSidebar }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    supportedLanguages[0]
  );

  const { getMessage } = chrome.i18n;

  const [accessToken, setAccessToken] = useState<string | null>("access-token");
  const [subscriptionType, setSubscriptionType] =
    useState<SubscriptionType | null>(SubscriptionType.FREE_TRIAL);

  const {
    start,
    resume,
    stop,
    isReady,
    status,
    isRecording,
    transcription,
    translation,
    error
  } = useAudioRecord({
    accessToken,
    subscriptionType
  });

  const { openSidePanel, close } = useExtensionControls();

  useEffect(() => {
    (async () => {
      const token = await storage.get(SessionToken.ACCESS);

      console.log("INIT", token);

      setAccessToken(token || null);
    })();
  }, []);

  storage.watch({
    [SessionToken.ACCESS]: ({ newValue }) => {
      console.log("WATCH", newValue);
      setAccessToken(newValue);
    },
    [StorageKey.DEPOSIT]: ({ newValue }) => {
      console.log(StorageKey.DEPOSIT, newValue);
    },
    [StorageKey.BALANCE]: ({ newValue }) => {
      console.log([StorageKey.BALANCE], newValue);
    }
  });

  const handleLanguageChange = useCallback((language: Language) => {
    setCurrentLanguage(language);
    chrome.storage.sync.set({ language: language });
  }, []);

  return (
    <div className="w-84">
      <div className="p-3 mb-2 bg-accent rounded-b-2xl">
        <div className="flex flex-row items-center justify-between mb-3 p-0 text-primary-foreground">
          <Logo />

          <div>
            {!isSidebar && (
              <Button
                size="icon"
                variant="raw"
                className="bg-transparent rotate-180"
                onClick={() => {
                  close();
                  openSidePanel();
                }}>
                <Sidebar
                  className="text-primary-foreground hover:text-primary-foreground/80"
                  size={24}
                />
              </Button>
            )}

            <Button
              size="icon"
              variant="raw"
              className="bg-transparent"
              onClick={close}>
              <CircleX
                size={24}
                className="text-primary-foreground hover:text-primary-foreground/80"
              />
            </Button>
          </div>
        </div>

        <h1 className="bg-blue-500 text-white p-4">{error}</h1>

        {/* <ErrorAlert
          title={intl.formatMessage({
            id: `${namespace}.unexpected`
          })}
          message={error.message}
          actionMessage={intl.formatMessage({
            id: `${actionNamespace}.reload`
          })}
        /> */}

        <Component />

        <div className="flex flex-row justify-between items-center mb-3">
          <Button variant="default" className="w-38">
            <a
              href={constructURLWithParams({
                //todo: make it const
                url: process.env.PLASMO_PUBLIC_UI_URL as string,
                params: {
                  action: "connect-wallet"
                }
              })}
              target="_blank"
              rel="noopener noreferrer">
              {getMessage("connectWallet")}
            </a>
          </Button>

          <Button variant="default" className="w-38">
            <a
              href={constructURLWithParams({
                url: process.env.PLASMO_PUBLIC_UI_URL as string,
                params: {
                  action: "deposit"
                }
              })}
              target="_blank"
              rel="noopener noreferrer">
              {getMessage("depositFunds")}
            </a>
          </Button>
        </div>

        <div className="flex flex-row justify-between items-center mb-2">
          <div className="flex flex-row items-center h-8 w-38 bg-accent-foreground rounded">
            <p className="px-3 text-primary-foreground font-medium text-sm">
              {/* {`${getMessage("balance")}: ${balance}`} */}
              {getMessage("balance")}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex flex-row justify-between items-center h-8 w-38 gap-2 text-primary bg-secondary px-3 rounded">
              <div className="flex flex-row items-center gap-2">
                <Languages size={16} />

                <span className="text-sm">{currentLanguage.name}</span>
              </div>

              <ChevronsUpDown size={12} />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="max-h-40 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-muted [&::-webkit-scrollbar-thumb]:bg-gray-300">
              {supportedLanguages.map(({ flagCode, name: language }) => (
                <DropdownMenuItem
                  key={flagCode}
                  className="cursor-pointer w-36"
                  onClick={() =>
                    handleLanguageChange({ flagCode, name: language })
                  }>
                  <ReactCountryFlag
                    countryCode={flagCode}
                    svg
                    cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                    cdnSuffix="svg"
                    title={language}
                    style={{ cursor: "pointer" }}
                    className="mr-2"
                  />
                  {language}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="px-3 text-primary-foreground font-medium text-sm">
          {`${getMessage("status")}: `}
          <span
            className={
              status === ConnectionStatus.CONNECTED
                ? "text-green-500"
                : status === ConnectionStatus.CONNECTING
                  ? "text-yellow-500"
                  : "text-red-500"
            }>
            {status}
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-3 px-3 py-2">
        <TextBlock className="bg-muted max-h-40 text-primary rounded-lg text-sm overflow-auto">
          <p>{transcription}</p>
        </TextBlock>

        <TextBlock className="bg-secondary-foreground max-h-44 text-primary rounded-lg text-sm overflow-auto">
          <p>{translation}</p>
        </TextBlock>

        <div className="flex flex-col gap-2">
          <Button
            disabled={isRecording}
            size="lg"
            onClick={() => (isReady ? resume() : start())}>
            <Play className="mr-2" />
            START-v2{" "}
          </Button>

          <Button
            disabled={!isRecording}
            size="lg"
            variant={"destructive"}
            onClick={stop}>
            <Square className="mr-2" />
            STOP-v2{" "}
          </Button>
        </div>
      </div>
    </div>
  );
};
