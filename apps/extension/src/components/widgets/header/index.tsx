import { useCallback, useEffect, useMemo, useState } from "react";
import ScaleIcon from "react:@/assets/scale-02.svg";
import CloseIcon from "react:@/assets/x-close.svg";

import {
  PRICING,
  SPLToken,
  SubscriptionType,
  TOKEN_CURRENCIES
} from "@repo/shared/constants";
import { roundToDecimals } from "@repo/shared/utils";
import { Icon } from "@repo/ui/components";

import { useAppContext } from "@/app/AppContext";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Logo
} from "@/components";
import {
  getTimeLeft,
  getpPossibleTime
} from "@/components/features/selectors/subscription-info/utils";
import ToggleTheme from "@/components/features/selectors/theme";
import { ConnectionStatus as ConnectionStatusWidget } from "@/components/widgets/connectionStatus";
import { InfoBlock } from "@/components/widgets/infoBlock";
import { WalletInfo } from "@/components/widgets/walletInfo";
import { UI_URL } from "@/constants";
import { useExtensionControls } from "@/hooks";
import { GA_EVENTS, gaEmitter } from "@/services";

export const Header = () => {
  const {
    currentPage,
    isSidebar,
    status,
    error,
    resume,
    subscriptionType,
    isRecording,
    isReady,
    setSubscriptionType,
    accessToken,
    balance,
    publicKey,
    freeHoursLeft,
    paidHoursLeft,
    nextFreeTime
  } = useAppContext();

  const { getMessage } = chrome.i18n;

  const { openSidePanel, close } = useExtensionControls();

  const SUBSCRIPTION_TYPE_MAP = useMemo(
    () => ({
      [SubscriptionType.FREE_TRIAL]: getMessage("freeTrial"),
      [SubscriptionType.PER_MINUTE]: getMessage("perMinute"),
      [SubscriptionType.PER_HOUR]: getMessage("perHour")
    }),
    []
  );

  const [balanceInfo, setBalanceInfo] = useState<string>("...");

  const [isInsufficientBalance, setIsInsufficientBalance] = useState(false);

  const onSubscriptionClick = useCallback((value: SubscriptionType) => {
    setSubscriptionType(value);
  }, []);

  useEffect(() => {
    if (typeof balance === "number") {
      setIsInsufficientBalance(balance < PRICING[subscriptionType]);
    }
  }, [balance, subscriptionType]);

  useEffect(() => {
    if (typeof balance === "number") {
      setBalanceInfo(
        getTimeLeft({
          type: subscriptionType,
          balance,
          freeHoursLeft,
          paidHoursLeft
        })
      );
    }
  }, [balance, subscriptionType, freeHoursLeft, paidHoursLeft]);

  return (
    <div className="px-3 py-2 mb-2 bg-gradient-to-r from-blue-400 dark:from-blue-500 dark:to-blue-200 to-green-300 rounded-b-2xl">
      <div className="flex flex-row items-center justify-between mb-1 p-0 text-primary-foreground">
        <Button className="p-0 bg-transparent hover:bg-transparent shadow-none">
          <a href={UI_URL} target="_blank" rel="noopener noreferrer">
            <Logo />
          </a>
        </Button>

        <div className="flex gap-1">
          <ToggleTheme />

          {!isSidebar && (
            <Button
              size="icon"
              variant="raw"
              className="bg-white dark:bg-dark-100 text-dark-100 dark:text-white-100 w-[30px] h-[30px] rounded-full flex justify-center items-center"
              onClick={openSidePanel}
            >
              <ScaleIcon className="w-5 h-5" />
            </Button>
          )}

          <Button
            size="icon"
            variant="raw"
            className="bg-white dark:bg-dark-100 text-dark-100 dark:text-white-100 w-[30px] h-[30px] rounded-full flex justify-center items-center"
            onClick={close}
          >
            <CloseIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {currentPage === "home" && publicKey && (
        <>
          <div className="flex gap-1 pb-2">
            <div className="flex-1">
              <InfoBlock
                title={SUBSCRIPTION_TYPE_MAP[subscriptionType]}
                blockInfo={[
                  {
                    title: getMessage("selectUsageType")
                  },
                  ...Object.values(SubscriptionType)
                    .filter((value) =>
                      balance
                        ? [
                            SubscriptionType.PER_MINUTE,
                            SubscriptionType.PER_HOUR
                          ].includes(value)
                        : value === SubscriptionType.FREE_TRIAL
                    )
                    .map((value) => {
                      const price = PRICING[value];
                      const isNotEnoughBalance =
                        typeof balance === "number" && balance < price;

                      return {
                        title: getMessage("subscriptionType"),
                        description: `${SUBSCRIPTION_TYPE_MAP[value]}${isNotEnoughBalance ? ` (${getMessage("insufficientBalance")})` : ""}`,
                        onClick: () =>
                          !isNotEnoughBalance && onSubscriptionClick(value),
                        disabled: isRecording || isReady || isNotEnoughBalance
                      };
                    })
                ]}
              />
            </div>
            <div className="flex-1">
              <InfoBlock
                title={getMessage("subscriptionInfo")}
                blockInfo={[
                  {
                    title: getMessage("balance"),
                    description: `${typeof balance === "number" ? `${roundToDecimals(balance)} ${TOKEN_CURRENCIES[SPLToken.USDC].symbol.toUpperCase()}` : "..."}`
                  },
                  typeof paidHoursLeft === "number" && {
                    title: getMessage("paidTimeLeft"),
                    description: balanceInfo
                  },
                  typeof paidHoursLeft === "number" && {
                    title: getMessage("possibleTime"),
                    description: isInsufficientBalance
                      ? getMessage("insufficientBalance")
                      : getpPossibleTime({
                          type: subscriptionType,
                          balance
                        })
                  },
                  typeof freeHoursLeft === "number" && {
                    title: getMessage("freeTimeLeft"),
                    description: balanceInfo
                  },
                  typeof freeHoursLeft === "number" &&
                    nextFreeTime && {
                      title: getMessage("nextFreeTime"),
                      description: nextFreeTime
                    }
                ].filter((item) => !!item)}
              />
            </div>
          </div>

          <div className="pb-2">
            <WalletInfo publicKey={publicKey} accessToken={accessToken} />
          </div>

          <div>
            <ConnectionStatusWidget status={status} />
          </div>
        </>
      )}

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
    </div>
  );
};
