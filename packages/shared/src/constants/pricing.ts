import { SubscriptionType } from "./subscription";

// todo: move to backend
export const PRICING = {
  [SubscriptionType.FREE_TRIAL]: 0,
  [SubscriptionType.PER_HOUR]: 1.2,
  [SubscriptionType.PER_MINUTE]: 0.03
};
