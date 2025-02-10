export enum SubscriptionType {
  FREE_TRIAL = "freeTrial",
  PER_MINUTE = "perMinute",
  PER_HOUR = "perHour"
  // PER_MONTH = "perMonth"
}

export const USAGE_TYPE_MAP = {
  [SubscriptionType.PER_MINUTE]: "Per Minute",
  [SubscriptionType.PER_HOUR]: "Per Hour"
};

// export const SUBSCRIPTION_TYPE_MAP = {
//   [SubscriptionType.FREE_TRIAL]: "Free Trial",
//   [SubscriptionType.PER_USAGE]: {
//     base: "Per Usage",
//     [SubscriptionType.PER_MINUTE]: "Per Minute",
//     [SubscriptionType.PER_HOUR]: "Per Hour"
//   }
//   // [SubscriptionType.PER_MONTH]: "Per Month"
// };
