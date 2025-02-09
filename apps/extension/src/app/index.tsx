import { type FC, useCallback, useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";

import { match } from "ts-pattern";

import {
  PRICING,
  SPLToken,
  TOKEN_CURRENCIES,
  USAGE_TYPE_MAP,
  UsageType
} from "@repo/shared/constants";
import {
  formatPublicKey,
  roundToDecimal,
  roundToDecimals
} from "@repo/shared/utils";
import { Icon } from "@repo/ui/components";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Logo,
  TextBlock
} from "@/components";
import "@/components/ui/textBlock";
import { ConnectionStatus, SUPPORTED_LANGUAGES, UI_URL } from "@/constants";
import "@/global.css";
import {
  useAccessToken,
  useAudioRecord,
  useExtensionControls,
  useTokenBalance
} from "@/hooks";
import { cn } from "@/lib/utils";
import { type Language } from "@/types";
import { constructURLWithParams } from "@/utils";

// todo: add env WSS var for manifest
//    "content_security_policy": {
//       "extension_pages": "script-src 'self'; connect-src 'self' wss://$ENV_VAR:*;"
//     }
// todo: add gobal error handler
// add senty

interface AppProps {
  isSidebar: boolean;
}

export const App: FC<AppProps> = ({ isSidebar }) => {
  const { getMessage } = chrome.i18n;

  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    SUPPORTED_LANGUAGES[0]
  );
  const [shouldUpdateBalance, setShouldUpdateBalance] = useState(false);

  // todo: use refresh token
  const { accessToken } = useAccessToken();

  const { balance, publicKey, freeHoursLeft } = useTokenBalance({
    accessToken,
    shouldUpdate: shouldUpdateBalance
  });

  const [usageType, setUsageType] = useState<UsageType>(
    balance ? UsageType.PER_HOUR : UsageType.FREE_TRIAL
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
    usageType
  });

  const { openSidePanel, close } = useExtensionControls();

  const handleLanguageChange = useCallback((language: Language) => {
    setCurrentLanguage(language);

    chrome.storage.sync.set({ language: language });
  }, []);

  useEffect(() => {
    setUsageType(
      balance
        ? usageType !== UsageType.FREE_TRIAL
          ? usageType
          : UsageType.PER_HOUR
        : UsageType.FREE_TRIAL
    );
  }, [balance]);

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
          <div className="flex flex-row items-center h-8 w-38   bg-white rounded">
            <p className="px-1 text-primary font-medium text-sm">
              {/* <p className="text-xs">{`${getMessage("balance")}`}:</p> */}

              {`${typeof balance === "number" ? `${roundToDecimals(balance)} ${TOKEN_CURRENCIES[SPLToken.USDC].symbol.toUpperCase()}` : "..."} `}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex flex-row justify-between items-center h-8 w-38 gap-2 text-primary px-1 bg-white rounded">
              <div className="flex flex-row items-center gap-2">
                <Icon name="Languages" size={16} />

                <span className="text-sm">{currentLanguage.name}</span>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="max-h-40 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-muted [&::-webkit-scrollbar-thumb]:bg-gray-300">
              {SUPPORTED_LANGUAGES.map(({ flagCode, name: language }) => (
                <DropdownMenuItem
                  disabled
                  key={flagCode}
                  className="cursor-pointer w-36"
                  onClick={() =>
                    handleLanguageChange({ flagCode, name: language })
                  }
                >
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

        <div className="flex flex-row justify-between items-center mb-2">
          <div className="flex flex-row items-center h-8 w-38 bg-white rounded">
            <span
              className={cn(
                match(status)
                  .with(ConnectionStatus.CONNECTED, () => "text-green-500")
                  .with(ConnectionStatus.CONNECTING, () => "text-yellow-500")
                  .with(ConnectionStatus.DISCONNECTED, () => "text-red-500")
                  .exhaustive(),
                "px-1  font-medium text-sm"
              )}
            >
              {status.toUpperCase()}
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex flex-row justify-between items-center h-8 w-38 gap-1 text-primary bg-white px-1 rounded">
              <div className="flex flex-row items-center gap-2">
                {/* <Icon name="Clock" size={16} /> */}

                <span className="text-sm">
                  {typeof balance === "number"
                    ? USAGE_TYPE_MAP[usageType]
                    : "..."}
                  <b>
                    {match(usageType)
                      .with(UsageType.FREE_TRIAL, () =>
                        typeof freeHoursLeft === "number"
                          ? ` ${roundToDecimal(freeHoursLeft, 1)}h`
                          : null
                      )
                      .with(UsageType.PER_HOUR, () =>
                        typeof balance === "number"
                          ? ` ${roundToDecimal(balance / PRICING.perHour, 1)}h`
                          : null
                      )
                      .with(UsageType.PER_MINUTE, () =>
                        typeof balance === "number"
                          ? ` ${roundToDecimal(balance / PRICING.perMinute)}m`
                          : null
                      )
                      .exhaustive()}
                  </b>
                </span>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="max-h-40 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-muted [&::-webkit-scrollbar-thumb]:bg-gray-300">
              {Object.values(UsageType)
                .filter((value) =>
                  balance
                    ? [UsageType.PER_MINUTE, UsageType.PER_HOUR].includes(value)
                    : value === UsageType.FREE_TRIAL
                )
                .map((value) => {
                  return (
                    <DropdownMenuItem
                      disabled={isRecording || isReady}
                      key={value}
                      className="cursor-pointer w-36"
                      onClick={() => setUsageType(value)}
                    >
                      <span>
                        {USAGE_TYPE_MAP[value]}
                        <b>
                          {match(value)
                            .with(UsageType.FREE_TRIAL, () =>
                              typeof freeHoursLeft === "number"
                                ? ` ${roundToDecimal(freeHoursLeft, 1)}h`
                                : null
                            )
                            .with(UsageType.PER_HOUR, () =>
                              typeof balance === "number"
                                ? ` ${roundToDecimal(balance / PRICING.perHour, 1)}h`
                                : null
                            )
                            .with(UsageType.PER_MINUTE, () =>
                              typeof balance === "number"
                                ? ` ${roundToDecimal(balance / PRICING.perMinute)}m`
                                : null
                            )
                            .exhaustive()}
                        </b>
                      </span>
                    </DropdownMenuItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
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
            disabled={isRecording || !accessToken}
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
