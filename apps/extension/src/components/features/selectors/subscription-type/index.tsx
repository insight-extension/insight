import React, { useMemo } from "react";

import { PRICING, SubscriptionType } from "@repo/shared/constants";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui";

interface SubscriptionTypeSelectorProps {
  balance: number | null;
  current: SubscriptionType;
  onChange: (SubscriptionType: SubscriptionType) => void;
  isDisabled: boolean;
}

export const SubscriptionTypeSelector: React.FC<
  SubscriptionTypeSelectorProps
> = ({ balance, current, onChange, isDisabled }) => {
  const { getMessage } = chrome.i18n;

  const SUBSCRIPTION_TYPE_MAP = useMemo(
    () => ({
      [SubscriptionType.FREE_TRIAL]: getMessage("freeTrial"),
      [SubscriptionType.PER_MINUTE]: getMessage("perMinute"),
      [SubscriptionType.PER_HOUR]: getMessage("perHour")
    }),
    []
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={current === SubscriptionType.FREE_TRIAL}
        className="flex justify-between items-center h-8 w-38 text-sm bg-white px-3 py-1 rounded border border-gray-300"
      >
        <span className="uppercase">{SUBSCRIPTION_TYPE_MAP[current]}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="max-h-40 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
        <DropdownMenuItem
          disabled={true}
          className="flex flex-col  cursor-pointer px-3 py-2 w-40"
        >
          <span className="text-sm text-gray-700">
            {getMessage("selectUsageType")}
          </span>
        </DropdownMenuItem>

        {Object.values(SubscriptionType)
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

            return (
              <DropdownMenuItem
                disabled={isDisabled || isNotEnoughBalance}
                key={value}
                className={`flex flex-col text-md cursor-pointer px-3 py-2 w-40 ${
                  isNotEnoughBalance
                    ? "text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => !isNotEnoughBalance && onChange(value)}
              >
                {SUBSCRIPTION_TYPE_MAP[value]}
                <span className="text-xs text-red-500">
                  {" "}
                  {isNotEnoughBalance &&
                    ` (${getMessage("insufficientBalance")})`}
                </span>
              </DropdownMenuItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
