import { PlanType } from "./subscription";

// todo: move to backend
export const PRICING = {
  [PlanType.FREE_TRIAL]: 0,
  [PlanType.PER_HOUR]: 1.2,
  [PlanType.PER_MINUTE]: 0.03
};
