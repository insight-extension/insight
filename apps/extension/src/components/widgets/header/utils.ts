import { P, match } from "ts-pattern";

import { PRICING, PlanType } from "@repo/shared/constants";
import { roundToDecimal } from "@repo/shared/utils";

const HOURS_LABEL = "h";
const MINUTES_LABEL = "m";
const MONTH_LABEL = "mo";

export const getTimeLeft = ({
  type,
  freeHoursLeft,
  balance,
  paidHoursLeft,
  paidDaysLeft,
}: {
  type: PlanType;
  balance: number;
  freeHoursLeft?: number | null;
  paidHoursLeft?: number | null;
  paidDaysLeft?: number | null;
}) => {
  // todo: use date-fns
  const toHours = (seconds: number) => seconds / 60 / 60;
  const toMinutes = (seconds: number) => seconds / 60;
  const toDays = (seconds: number) => seconds / 60 / 60 / 24;

  return match({ type, freeHoursLeft, balance, paidHoursLeft, paidDaysLeft })
    .with(
      {
        type: PlanType.FREE_TRIAL,
        freeHoursLeft: P.intersection(P.number, P.select())
      },
      (seconds) => `${roundToDecimal(toHours(seconds), 1)}${HOURS_LABEL}`
    )
    .with(
      {
        type: PlanType.PER_HOUR,
        paidHoursLeft: P.intersection(P.number, P.select())
      },
      (seconds) => `${roundToDecimal(toHours(seconds), 1)}${HOURS_LABEL}`
    )
    .with(
      {
        type: PlanType.PER_MINUTE,
        paidHoursLeft: P.intersection(P.number, P.select())
      },
      (seconds) => `${roundToDecimal(toMinutes(seconds), 1)}${MINUTES_LABEL}`
    )
    .with(
      {
        type: PlanType.PER_MONTH,
        paidDaysLeft: P.intersection(P.number, P.select())
      },
      (seconds) => `${roundToDecimal(toDays(seconds), 1)}${MONTH_LABEL}`
    )
    .otherwise(() => "...");
};

export const getpPossibleTime = ({
  type,
  balance
}: {
  type: PlanType;
  balance: number | null;
}) => {
  if (!balance) return "...";

  return match({ type, balance })
    .with(
      { type: PlanType.PER_HOUR },
      () => `${roundToDecimal(balance / PRICING.perHour, 1)}${HOURS_LABEL}`
    )
    .with(
      { type: PlanType.PER_MINUTE },
      () => `${roundToDecimal(balance / PRICING.perMinute)}${MINUTES_LABEL}`
    )
    .with(
      { type: PlanType.PER_MONTH },
      () => `${roundToDecimal(balance / PRICING.perMonth, 1)}${MONTH_LABEL}`
    )
    .otherwise(() => "...");
};
