import React, { useMemo } from "react";

import { SubscriptionType } from "@repo/shared/constants";

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

export const SubscriptionTypeSelector: React.FC<
  SubscriptionTypeSelectorProps
> = ({ balance, current, onChange, freeHoursLeft, isDisabled }) => {
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
        className="flex justify-start items-center h-8 w-38 text-sm text-primary bg-white px-2 rounded"
      >
        {typeof balance === "number" ? (
          <>
            {SUBSCRIPTION_TYPE_MAP[current]}
            {": "}

            {getTimeLeft({
              type: current,
              balance,
              freeHoursLeft
            })}
          </>
        ) : (
          "..."
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="max-h-40 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-muted [&::-webkit-scrollbar-thumb]:bg-gray-300">
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
            return (
              <DropdownMenuItem
                disabled={isDisabled || current === SubscriptionType.FREE_TRIAL}
                key={value}
                className="cursor-pointer w-36"
                onClick={() => onChange(value)}
              >
                {SUBSCRIPTION_TYPE_MAP[value]}
              </DropdownMenuItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
