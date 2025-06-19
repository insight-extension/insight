import { P, match } from "ts-pattern";

import { PRICING, SubscriptionType } from "@repo/shared/constants";
import { roundToDecimal } from "@repo/shared/utils";

const HOURS_LABEL = "h";
const MINUTES_LABEL = "m";

export const getTimeLeft = ({
  type,
  freeHoursLeft,
  balance,
  paidHoursLeft
}: {
  type: SubscriptionType;
  balance: number;
  freeHoursLeft?: number | null;
  paidHoursLeft?: number | null;
}) => {
  // todo: use date-fns
  const toHours = (seconds: number) => seconds / 60 / 60;
  const toMinutes = (seconds: number) => seconds / 60;

  return match({ type, freeHoursLeft, balance, paidHoursLeft })
    .with(
      {
        type: SubscriptionType.FREE_TRIAL,
        freeHoursLeft: P.intersection(P.number, P.select())
      },
      (seconds) => `${roundToDecimal(toHours(seconds), 1)}${HOURS_LABEL}`
    )
    .with(
      {
        type: SubscriptionType.PER_HOUR,
        paidHoursLeft: P.intersection(P.number, P.select())
      },
      (seconds) => `${roundToDecimal(toHours(seconds), 1)}${HOURS_LABEL}`
    )
    .with(
      {
        type: SubscriptionType.PER_MINUTE,
        paidHoursLeft: P.intersection(P.number, P.select())
      },
      (seconds) => `${roundToDecimal(toMinutes(seconds), 1)}${MINUTES_LABEL}`
    )
    .otherwise(() => "...");
};

export const getpPossibleTime = ({
  type,
  balance
}: {
  type: SubscriptionType;
  balance: number | null;
}) => {
  if (!balance) return "...";

  return match({ type, balance })
    .with(
      { type: SubscriptionType.PER_HOUR },
      () => `${roundToDecimal(balance / PRICING.perHour, 1)}${HOURS_LABEL}`
    )
    .with(
      { type: SubscriptionType.PER_MINUTE },
      () => `${roundToDecimal(balance / PRICING.perMinute)}${MINUTES_LABEL}`
    )
    .otherwise(() => "...");
};
