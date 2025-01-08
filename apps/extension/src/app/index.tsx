import { type FC, useCallback, useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";

import { match } from "ts-pattern";

import { SessionToken, SubscriptionType } from "@repo/shared/constants";
import { ErrorAlert, Icon } from "@repo/ui/components";
import { cn } from "@repo/ui/lib";

import { storage } from "@/background";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Logo,
  TextBlock
} from "@/components";
import "@/components/ui/textBlock";
import {
  ConnectionStatus,
  SUPPORTED_LANGUAGES,
  StorageKey,
  UI_URL
} from "@/constants";
import "@/global.css";
import { useAudioRecord, useExtensionControls } from "@/hooks";
import { type Language } from "@/types";
import { constructURLWithParams } from "@/utils";

// todo: add env WSS var for manifest
//    "content_security_policy": {
//       "extension_pages": "script-src 'self'; connect-src 'self' wss://$ENV_VAR:*;"
//     }

interface AppProps {
  isSidebar: boolean;
}

export const App: FC<AppProps> = ({ isSidebar }) => {
  const { getMessage } = chrome.i18n;

  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    SUPPORTED_LANGUAGES[0]
  );
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

      setAccessToken(token || null);
    })();
  }, []);

  storage.watch({
    [SessionToken.ACCESS]: ({ newValue }) => {
      setAccessToken(newValue);
    },
    [StorageKey.DEPOSIT]: ({ newValue }) => {
      console.log(StorageKey.DEPOSIT, newValue);
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
                onClick={openSidePanel}>
                <Icon
                  name="Sidebar"
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
              <Icon
                name="CircleX"
                size={24}
                className="text-primary-foreground hover:text-primary-foreground/80"
              />
            </Button>
          </div>
        </div>

        {/* // todo: complete the styles */}
        {error && (
          <ErrorAlert
            className={cn("bg-red-500 text-white", "my-6")}
            message={error.message}
            actionMessage={getMessage("retry")}
            title={getMessage("error")}
            onAction={resume} // todo: change to restart
          />
        )}

        <div className="flex flex-row justify-between items-center mb-3">
          <Button variant="default" className="w-38">
            <a
              href={constructURLWithParams({
                url: UI_URL,
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
                url: UI_URL,
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
                <Icon name="Languages" size={16} />

                <span className="text-sm">{currentLanguage.name}</span>
              </div>

              <Icon name="ChevronsUpDown" size={12} />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="max-h-40 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-muted [&::-webkit-scrollbar-thumb]:bg-gray-300">
              {SUPPORTED_LANGUAGES.map(({ flagCode, name: language }) => (
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
            className={match(status)
              .with(ConnectionStatus.CONNECTED, () => "text-green-500")
              .with(ConnectionStatus.CONNECTING, () => "text-yellow-500")
              .with(ConnectionStatus.DISCONNECTED, () => "text-red-500")
              .exhaustive()}>
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
            onClick={isReady ? resume : start}>
            <Icon name="Play" className="mr-2" />

            {isReady ? getMessage("resume") : getMessage("start")}
          </Button>

          <Button
            disabled={!isRecording}
            size="lg"
            variant={"destructive"}
            onClick={stop}>
            <Icon name="Square" className="mr-2" />

            {getMessage("stop")}
          </Button>
        </div>
      </div>
    </div>
  );
};

// todo:
// 1. auth flow +
// 2. access token flow +
// 3. subscription flow
// 4. language flow
// 5. audio recording flow
