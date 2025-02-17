import { type FC, useCallback, useEffect, useState } from "react";

import { match } from "ts-pattern";

import {
  SPLToken,
  SubscriptionType,
  TOKEN_CURRENCIES
} from "@repo/shared/constants";
import { formatPublicKey, roundToDecimals } from "@repo/shared/utils";
import { Icon } from "@repo/ui/components";
import { cn } from "@repo/ui/lib";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Logo,
  TextBlock
} from "@/components";
import {
  LanguageSelector,
  SubscriptionTypeSelector
} from "@/components/features";
import { ConnectionStatus, SUPPORTED_LANGUAGES, UI_URL } from "@/constants";
import "@/global.css";
import {
  useAccessToken,
  useAudioRecord,
  useExtensionControls,
  useTokenBalance
} from "@/hooks";
import { type Language } from "@/types";
import { constructURLWithParams } from "@/utils";

// todo: add env WSS var for manifest
//    "content_security_policy": {
//       "extension_pages": "script-src 'self'; connect-src 'self' wss://$ENV_VAR:*;"
//     }

interface AppProps {
  width: "sidebar" | "popup";
  isSidebar: boolean;
}

export const App: FC<AppProps> = ({ isSidebar, width }) => {
  const { getMessage } = chrome.i18n;

  // TODO: USE DYNAMIC LANGUAGES
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    SUPPORTED_LANGUAGES.en
  );
  const [shouldUpdateBalance, setShouldUpdateBalance] = useState(false);

  const { accessToken } = useAccessToken();

  const { balance, publicKey, freeHoursLeft } = useTokenBalance({
    accessToken,
    shouldUpdate: shouldUpdateBalance
  });

  const [subscriptionType, setSubscriptionType] = useState<SubscriptionType>(
    balance ? SubscriptionType.PER_MINUTE : SubscriptionType.FREE_TRIAL
  );

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
    setSubscriptionType(
      balance
        ? subscriptionType !== SubscriptionType.FREE_TRIAL
          ? subscriptionType
          : SubscriptionType.PER_MINUTE
        : SubscriptionType.FREE_TRIAL
    );
  }, [balance]);

  return (
    <div className={cn(width === "sidebar" ? "w-90" : "w-84")}>
      <div className="p-3 mb-2 bg-accent rounded-b-2xl">
        <div className="flex flex-row items-center justify-between mb-3 p-0 text-primary-foreground">
          <Logo />

          <div>
            {!isSidebar && (
              <Button
                size="icon"
                variant="raw"
                className="bg-transparent rotate-180"
                onClick={openSidePanel}
              >
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
              onClick={close}
            >
              <Icon
                name="CircleX"
                size={24}
                className="text-primary-foreground hover:text-primary-foreground/80"
              />
            </Button>
          </div>
        </div>

        {error && (
          <Alert
            variant="destructive"
            className="my-6 w-full bg-red-500 flex flex-col items-center"
          >
            <div className="flex flex-col items-center mb-8">
              <AlertTitle className="text-lg">{getMessage("error")}</AlertTitle>

              <AlertDescription className="text-md">
                {error.message}
              </AlertDescription>
            </div>

            <div className="flex flex-col items-center gap-2 mb-4">
              <Button size="lg" onClick={resume}>
                <Icon name="Play" className="mr-2" />

                {getMessage("retry")}
              </Button>
            </div>
          </Alert>
        )}

        <div className="flex flex-row justify-between items-center mb-3">
          <Button variant="default" className="w-38 bg-secondary text-start">
            {publicKey ? (
              formatPublicKey(publicKey)
            ) : (
              <a
                href={constructURLWithParams({
                  url: UI_URL,
                  params: {
                    action: "connect-wallet"
                  }
                })}
                target="_blank"
                rel="noopener noreferrer"
              >
                {getMessage("connectWallet")}
              </a>
            )}
          </Button>

          <Button
            variant="default"
            className="w-38 bg-secondary text-start"
            disabled={!accessToken}
          >
            <a
              href={constructURLWithParams({
                url: UI_URL,
                params: {
                  action: "deposit"
                }
              })}
              target="_blank"
              rel="noopener noreferrer"
            >
              {getMessage("depositFunds")}
            </a>
          </Button>
        </div>

        <div className="flex flex-row justify-between items-center mb-2">
          <div className="flex flex-row items-center h-8 w-38 bg-white rounded">
            <p className="px-2 text-primary font-medium text-sm">
              {/* <p className="text-xs">{`${getMessage("balance")}`}:</p> */}

              {`${typeof balance === "number" ? `${roundToDecimals(balance)} ${TOKEN_CURRENCIES[SPLToken.USDC].symbol.toUpperCase()}` : "..."} `}
            </p>
          </div>
          From:
          <LanguageSelector
            current={SUPPORTED_LANGUAGES.en}
            onChange={useCallback((language: Language) => {
              setCurrentLanguage(language);

              chrome.storage.sync.set({ language: language });
            }, [])}
          />
        </div>

        <div className="flex flex-row justify-between items-center mb-2">
          <div className="flex flex-row items-center h-8 w-38 bg-white rounded">
            <p className="px-2 text-primary font-medium text-sm">
              ADD FIELD HERE
            </p>
          </div>
          To:
          <LanguageSelector
            current={SUPPORTED_LANGUAGES.ua}
            onChange={useCallback((language: Language) => {
              setCurrentLanguage(language);

              chrome.storage.sync.set({ language: language });
            }, [])}
          />
        </div>

        <div className="flex flex-row justify-between items-center mb-2">
          <div className="flex flex-row items-center h-8 w-38 bg-white rounded">
            <span
              className={cn(
                match(status)
                  .with(ConnectionStatus.CONNECTED, () => "text-green-500")
                  .with(ConnectionStatus.CONNECTING, () => "text-yellow-500")
                  .with(ConnectionStatus.DISCONNECTED, () => "text-red-500")
                  .exhaustive(),
                "px-2 font-medium text-sm"
              )}
            >
              {status.toUpperCase()}
            </span>
          </div>

          <SubscriptionTypeSelector
            balance={balance}
            freeHoursLeft={freeHoursLeft}
            current={subscriptionType}
            onChange={useCallback((value: SubscriptionType) => {
              setSubscriptionType(value);
            }, [])}
            isDisabled={isRecording || isReady}
          />
        </div>
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
            disabled={
              isRecording || !accessToken || typeof balance !== "number"
            }
            size="lg"
            onClick={() => {
              setShouldUpdateBalance(false);

              isReady ? resume() : start();
            }}
          >
            <Icon name="Play" className="mr-2" />

            {isReady ? getMessage("resume") : getMessage("start")}
          </Button>

          <Button
            disabled={!isRecording || !accessToken}
            size="lg"
            variant={"destructive"}
            onClick={() => {
              stop();

              setShouldUpdateBalance(true);
            }}
          >
            <Icon name="Square" className="mr-2" />

            {getMessage("stop")}
          </Button>
        </div>
      </div>
    </div>
  );
};
