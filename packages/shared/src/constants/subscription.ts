export enum PlanType {
  FREE_TRIAL = "freeTrial",
  PER_MINUTE = "perMinute",
  PER_HOUR = "perHour",
  PER_MONTH = "perMonth"
}

export enum UsageType {
  PER_USAGE = "perUsage",
  SUBSCRIPTION = "subscription"
}

export const USAGE_TYPE_MAP = {
  [PlanType.PER_MINUTE]: "Per Minute",
  [PlanType.PER_HOUR]: "Per Hour",
  [PlanType.PER_MONTH]: "Per Month"
};

// export const SUBSCRIPTION_TYPE_MAP = {
//   [PlanType.FREE_TRIAL]: "Free Trial",
//   [PlanType.PER_USAGE]: {
//     base: "Per Usage",
//     [PlanType.PER_MINUTE]: "Per Minute",
//     [PlanType.PER_HOUR]: "Per Hour"
//   }
//   // [PlanType.PER_MONTH]: "Per Month"
// };
