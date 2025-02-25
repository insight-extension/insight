import React, { useEffect, useState } from "react";

import {
  PRICING,
  SPLToken,
  SubscriptionType,
  TOKEN_CURRENCIES
} from "@repo/shared/constants";
import { roundToDecimals } from "@repo/shared/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui";

import { getTimeLeft, getpPossibleTime } from "./utils";

interface SubscriptionInfoSelectorProps {
  balance: number | null;
  freeHoursLeft: number | null;
  paidHoursLeft: number | null;
  current: SubscriptionType;
  nextFreeTime: string | null;
}

export const SubscriptionInfoSelector: React.FC<
  SubscriptionInfoSelectorProps
> = ({ balance, current, freeHoursLeft, paidHoursLeft, nextFreeTime }) => {
  const { getMessage } = chrome.i18n;

  const [balanceInfo, setBalanceInfo] = useState<string>("...");

  useEffect(() => {
    if (typeof balance === "number") {
      setBalanceInfo(
        getTimeLeft({
          type: current,
          balance,
          freeHoursLeft,
          paidHoursLeft
        })
      );
    }
  }, [balance, current, freeHoursLeft, paidHoursLeft]);

  const [isInsufficientBalance, setIsInsufficientBalance] = useState(false);

  useEffect(() => {
    if (typeof balance === "number") {
      setIsInsufficientBalance(balance < PRICING[current]);
    }
  }, [balance, current]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex justify-between items-center h-8 w-38 text-sm bg-white px-3 py-1 rounded border border-gray-300">
        <span className="">{getMessage("subscriptionInfo")}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-4 max-h-40 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
        <div className="flex flex-col gap-4">
          <p className="text-sm">
            {getMessage("balance")}:{" "}
            <span className="font-bold">
              {`${typeof balance === "number" ? `${roundToDecimals(balance)} ${TOKEN_CURRENCIES[SPLToken.USDC].symbol.toUpperCase()}` : "..."} `}
            </span>
          </p>

          {typeof paidHoursLeft === "number" && (
            <>
              <p className="text-sm">
                <span>{getMessage("paidTimeLeft")}:</span>{" "}
                <span className="font-bold">{balanceInfo}</span>
              </p>

              <p className="text-sm">
                <span>{getMessage("possibleTime")}:</span>{" "}
                {isInsufficientBalance ? (
                  <p className="text-sm text-red-500">
                    <span>{getMessage("insufficientBalance")}</span>
                  </p>
                ) : (
                  <span className="font-bold">
                    {getpPossibleTime({
                      type: current,
                      balance
                    })}
                  </span>
                )}
              </p>
            </>
          )}

          {typeof freeHoursLeft === "number" && (
            <>
              <p className="text-sm">
                <span>{getMessage("freeTimeLeft")}:</span>{" "}
                <span className="font-bold">{balanceInfo}</span>
              </p>

              {nextFreeTime && (
                <p className="text-sm">
                  <span>{getMessage("nextFreeTime")}:</span>{" "}
                  <span className="font-bold text-sm">{nextFreeTime}</span>
                </p>
              )}
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
