import { useCallback, useEffect, useMemo, useState } from "react";
import LogoIcon from "react:@/assets/logo.svg";
import PlayIcon from "react:@/assets/play.svg";
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
import ToggleTheme from "@/components/features/selectors/theme";
import { ConnectionStatus as ConnectionStatusWidget } from "@/components/widgets/connectionStatus/ConnectionStatus";
import {
  getTimeLeft,
  getpPossibleTime
} from "@/components/widgets/header/utils";
import { InfoBlock } from "@/components/widgets/infoBlock/InfoBlock";
import { WalletInfo } from "@/components/widgets/walletInfo/WalletInfo";
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
    <div className="p-3 mb-2 bg-gradient-to-r from-blue-400 dark:from-blue-500 dark:to-blue-200 to-green-300 rounded-b-2xl">
      <div className="flex flex-row items-center justify-between p-0">
        <button className="p-0 bg-transparent hover:bg-transparent shadow-none">
          <a href={UI_URL} target="_blank" rel="noopener noreferrer">
            <LogoIcon />
          </a>
        </button>

        <div className="flex gap-1">
          <ToggleTheme />

          {!isSidebar && (
            <button
              className="bg-white dark:bg-dark-100 text-dark-100 dark:text-white-100 w-[30px] h-[30px] rounded-full flex justify-center items-center"
              onClick={openSidePanel}
            >
              <ScaleIcon className="w-5 h-5" />
            </button>
          )}

          <button
            className="bg-white dark:bg-dark-100 text-dark-100 dark:text-white-100 w-[30px] h-[30px] rounded-full flex justify-center items-center"
            onClick={close}
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {currentPage === "home" && publicKey && (
        <>
          <div className="flex gap-1 pb-2 mt-3">
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

      {false && (
        <div className="bg-white dark:bg-dark-100 w-full rounded-[17px] overflow-hidden mt-2 border-2 border-red-400">
          <div className="w-full bg-red-400/20 flex flex-col items-center gap-1 p-3">
            <div className="flex flex-col items-center text-md text-red-400">
              <div>{getMessage("error")}</div>

              <div className="text-sm">{error?.message || "123123"}</div>
            </div>

            <button
              className="flex text-sm items-center gap-1 rounded-full bg-red-400 px-3 py-1 text-white dark:text-dark-100"
              onClick={async () => {
                await gaEmitter.emitEvent(GA_EVENTS.RETRY_TRANSLATION);

                resume();
              }}
            >
              <PlayIcon className="w-[17px] h-[17px]" />
              {getMessage("retry")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
