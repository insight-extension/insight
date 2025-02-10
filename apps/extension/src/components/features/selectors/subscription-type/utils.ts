import { P, match } from "ts-pattern";

import { PRICING, SubscriptionType } from "@repo/shared/constants";
import { roundToDecimal } from "@repo/shared/utils";

export const getTimeLeft = ({
  type,
  freeHoursLeft,
  balance
}: {
  type: SubscriptionType;
  balance: number;
  freeHoursLeft?: number | null;
}) => {
  const HOURS_LABEL = "h";
  const MINUTES_LABEL = "min";

  return match({ type, freeHoursLeft, balance })
    .with(
      {
        type: SubscriptionType.FREE_TRIAL,
        freeHoursLeft: P.intersection(P.number, P.select())
      },
      (hours) => `${roundToDecimal(hours, 1)}${HOURS_LABEL}`
    )
    .with(
      {
        type: SubscriptionType.PER_HOUR
      },
      () => `${roundToDecimal(balance / PRICING.perHour, 1)}${HOURS_LABEL}`
    )
    .with(
      {
        type: SubscriptionType.PER_MINUTE
      },
      () => `${roundToDecimal(balance / PRICING.perMinute)}${MINUTES_LABEL}`
    )
    .otherwise(() => "...");
};
