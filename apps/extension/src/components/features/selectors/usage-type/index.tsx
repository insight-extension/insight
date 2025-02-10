import React from "react";
import ReactCountryFlag from "react-country-flag";

import { match } from "ts-pattern";

import { PRICING, USAGE_TYPE_MAP, UsageType } from "@repo/shared/constants";
import { roundToDecimal } from "@repo/shared/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui";

interface UsageTypeSelectorProps {
  balance: number | null;
  freeHoursLeft: number | null;
  current: UsageType;
  onChange: (usageType: UsageType) => void;
  isDisabled: boolean;
}

export const UsageTypeSelector: React.FC<UsageTypeSelectorProps> = ({
  balance,
  current,
  onChange,
  freeHoursLeft,
  isDisabled
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex flex-row justify-between items-center h-8 w-38 gap-1 text-primary bg-white px-1 rounded">
        <div className="flex flex-row items-center gap-2">
          {/* <Icon name="Clock" size={16} /> */}

          <span className="text-sm">
            {typeof balance === "number" ? USAGE_TYPE_MAP[current] : "..."}
            <b>
              {match(current)
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
                disabled={isDisabled}
                key={value}
                className="cursor-pointer w-36"
                onClick={() => onChange(value)}
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
  );
};
