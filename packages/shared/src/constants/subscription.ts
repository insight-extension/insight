export enum SubscriptionType {
  PER_USAGE = "perUsage"
}

export enum UsageType {
  PER_MINUTE = "perHour",
  PER_HOUR = "perMinute",
  FREE_TRIAL = "freeTrial"
}

export const USAGE_TYPE_MAP = {
  [UsageType.FREE_TRIAL]: "Free Trial",
  [UsageType.PER_MINUTE]: "Per Minute",
  [UsageType.PER_HOUR]: "Per Hour"
};
