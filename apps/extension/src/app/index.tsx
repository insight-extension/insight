import { type FC, useCallback, useEffect, useState } from "react";

import instagramLogo from "data-base64:../../assets/instagram.svg";
import linkedinLogo from "data-base64:../../assets/linkedin.svg";
import xLogo from "data-base64:../../assets/x.svg";
import debounce from "debounce";
import { match } from "ts-pattern";

import { SubscriptionType } from "@repo/shared/constants";
import { formatPublicKey } from "@repo/shared/utils";
import { Icon } from "@repo/ui/components";
import { cn } from "@repo/ui/lib";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Logo,
  TextBlock
} from "@/components";
import {
  LanguageSelector,
  SubscriptionInfoSelector,
  SubscriptionTypeSelector
} from "@/components/features";
import { ConnectionStatus, TRANSLATION_LANGUAGES, UI_URL } from "@/constants";
import "@/global.css";
import {
  useAccessToken,
  useAudioRecord,
  useExtensionControls,
  useTokenBalance
} from "@/hooks";
import { GA_EVENTS, gaEmitter } from "@/services";
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

  const [isCopied, setIsCopied] = useState<boolean>(false);

  const [sourceLanguage, setSourceLanguage] = useState<Language>(
    TRANSLATION_LANGUAGES.find((language) => language.countryCode === "US")!
  );
  const [targetLanguage, setTargetLanguage] = useState<Language>(
    TRANSLATION_LANGUAGES.find((language) => language.countryCode === "UA")!
  );
  const [shouldUpdateBalance, setShouldUpdateBalance] = useState(false);

  const { accessToken } = useAccessToken();

  const { balance, publicKey, freeHoursLeft, paidHoursLeft, nextFreeTime } =
    useTokenBalance({
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
    subscriptionType,
    sourceLanguageAlpha2Code: sourceLanguage?.alpha2,
    targetLanguageAlpha2Code: targetLanguage?.alpha2
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
    <div className={cn(width === "sidebar" ? "w-90" : "w-84", "h-full")}>
      <div className="px-3 py-2 mb-2 bg-accent rounded-b-2xl">
        <div className="flex flex-row items-center justify-between mb-1 p-0 text-primary-foreground">
          <Button className="p-0 bg-transparent hover:bg-transparent shadow-none">
            <a href={UI_URL} target="_blank" rel="noopener noreferrer">
              <Logo />
            </a>
          </Button>

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
              <Button
                size="lg"
                onClick={async () => {
                  await gaEmitter.emitEvent(GA_EVENTS.RETRY_TRANSLATION);

                  resume();
                }}
              >
                <Icon name="Play" className="mr-2" />

                {getMessage("retry")}
              </Button>
            </div>
          </Alert>
        )}

        <div className="flex flex-row justify-between items-center mb-3 gap-2">
          <Button
            variant="default"
            className="w-38 bg-secondary text-start"
            onClick={async () => {
              if (!publicKey) return;

              await navigator.clipboard.writeText(publicKey);

              setIsCopied(true);

              debounce(() => setIsCopied(false), 400)();
            }}
          >
            {publicKey ? (
              formatPublicKey(publicKey) +
              (isCopied ? ` ${getMessage("copied")}` : "")
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

        <div className="flex flex-row justify-between items-center mb-2 gap-2">
          <SubscriptionTypeSelector
            balance={balance}
            current={subscriptionType}
            onChange={useCallback((value: SubscriptionType) => {
              setSubscriptionType(value);
            }, [])}
            isDisabled={isRecording || isReady}
          />

          <LanguageSelector
            disabled={isRecording}
            label={getMessage("from")}
            current={sourceLanguage}
            exclude={targetLanguage}
            onChange={useCallback((language: Language) => {
              setSourceLanguage(language);

              // todo: review usage
              // chrome.storage.sync.set({ language: language });
            }, [])}
          />
        </div>

        <div className="flex flex-row justify-between items-center mb-2 gap-2">
          <SubscriptionInfoSelector
            balance={balance}
            freeHoursLeft={freeHoursLeft}
            current={subscriptionType}
            paidHoursLeft={paidHoursLeft}
            nextFreeTime={nextFreeTime}
          />

          <LanguageSelector
            disabled={isRecording}
            label={getMessage("to")}
            current={targetLanguage}
            exclude={sourceLanguage}
            onChange={useCallback((language: Language) => {
              setTargetLanguage(language);
            }, [])}
          />
        </div>

        <div className="flex flex-row justify-center text-center items-center w-full h-8  bg-white rounded">
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
      </div>

      <div className="flex flex-col gap-2 px-3 py-1">
        <Accordion
          type="multiple"
          className="w-full flex flex-col gap-2"
          defaultChecked
          defaultValue={["item-1", "item-2"]}
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="p-0">Transcription</AccordionTrigger>
            <AccordionContent>
              <TextBlock className="bg-muted max-h-40 text-primary rounded-lg text-sm overflow-auto">
                <p>{transcription}</p>
              </TextBlock>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="p-0">Translation</AccordionTrigger>
            <AccordionContent>
              <TextBlock className="bg-secondary-foreground max-h-44 text-primary rounded-lg text-sm overflow-auto">
                <p>{translation}</p>
              </TextBlock>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-col gap-2">
          <Button
            disabled={
              isRecording || !accessToken || typeof balance !== "number"
            }
            size="lg"
            onClick={async () => {
              await gaEmitter.emitEvent(
                isReady
                  ? GA_EVENTS.RESUME_TRANSLATION
                  : GA_EVENTS.START_TRANSLATION,
                {
                  source_language: sourceLanguage.alpha2,
                  target_language: targetLanguage.alpha2,
                  subscription_type: subscriptionType
                }
              );

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
            onClick={async () => {
              await gaEmitter.emitEvent(GA_EVENTS.STOP_TRANSLATION);

              stop();

              setShouldUpdateBalance(true);
            }}
          >
            <Icon name="Square" className="mr-2" />

            {getMessage("stop")}
          </Button>
        </div>
      </div>

      <div className="flex flex-row justify-start items-center px-3 py-2 gap-3 border-t border-border bg-dark">
        <p className="text-sm text-white">Follow us</p>

        <Button className="p-0 w-5 h-5 bg-transparent hover:bg-transparent shadow-none">
          <a
            href="https://x.com/insight_xyz"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={xLogo} alt="x" width={20} height={20} />
          </a>
        </Button>

        <Button className="p-0 w-5 h-5 bg-transparent hover:bg-transparent shadow-none">
          <a
            href="https://www.instagram.com/insight.xyz/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={instagramLogo} alt="instagram" width={20} height={20} />
          </a>
        </Button>

        <Button className="p-0 w-5 h-5 bg-transparent hover:bg-transparent shadow-none">
          <a
            href="https://www.linkedin.com/company/insight-xyz/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={linkedinLogo} alt="linkedin" width={20} height={20} />
          </a>
        </Button>
      </div>
    </div>
  );
};
