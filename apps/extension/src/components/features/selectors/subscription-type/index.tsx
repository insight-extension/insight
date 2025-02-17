import React, { useMemo } from "react";

import { PRICING, SubscriptionType } from "@repo/shared/constants";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui";

import { getTimeLeft } from "./utils";

interface SubscriptionTypeSelectorProps {
  balance: number | null;
  freeHoursLeft: number | null;
  current: SubscriptionType;
  onChange: (SubscriptionType: SubscriptionType) => void;
  isDisabled: boolean;
}

export const SubscriptionTypeSelector: React.FC<SubscriptionTypeSelectorProps> = ({
  balance,
  current,
  onChange,
  freeHoursLeft,
  isDisabled
}) => {
  const { getMessage } = chrome.i18n;

  const SUBSCRIPTION_TYPE_MAP = useMemo(
    () => ({
      [SubscriptionType.FREE_TRIAL]: getMessage("freeTrial"),
      [SubscriptionType.PER_MINUTE]: getMessage("perMinute"),
      [SubscriptionType.PER_HOUR]: getMessage("perHour")
    }),
    []
  );

  let balanceInfo = "...";

  if (typeof balance === "number") {
    balanceInfo = getTimeLeft({ type: current, balance, freeHoursLeft });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={current === SubscriptionType.FREE_TRIAL}
        className="flex justify-between items-center h-8 w-40 text-sm bg-white px-3 py-1 rounded border border-gray-300"
      >
        <span className="text-gray-700">{SUBSCRIPTION_TYPE_MAP[current]}:</span>
        <span className="ml-2">{balanceInfo}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="max-h-40 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
        {Object.values(SubscriptionType)
          .filter((value) =>
            balance
              ? [SubscriptionType.PER_MINUTE, SubscriptionType.PER_HOUR].includes(value)
              : value === SubscriptionType.FREE_TRIAL
          )
          .map((value) => {
            const price = PRICING[value];
            const isNotEnoughBalance = typeof balance === "number" && balance < price;

            return (
              <DropdownMenuItem
                disabled={isDisabled || isNotEnoughBalance}
                key={value}
                className={`cursor-pointer px-3 py-2 w-40 ${isNotEnoughBalance ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"
                  }`}
                onClick={() => !isNotEnoughBalance && onChange(value)}
              >
                {SUBSCRIPTION_TYPE_MAP[value]}
                {isNotEnoughBalance && ` (Insufficient balance)`}
              </DropdownMenuItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
