import { SPLToken } from "@/constants/tokens";

export enum RelayRoute {
  DEPOSIT = "deposit",
  BALANCE = "balance",
  AUTH_TOKENS = "authTokens"
}

export enum RelayStatus {
  SUCCESS = "success",
  PARSE_ERROR = "parseError",
  ERROR = "error"
}

export interface RelayResponse {
  status: RelayStatus;
}

export interface DepositMessage {
  amount: number;
  token: SPLToken;
  // subscriptionType: SubscriptionType;
  transactionSignature: string;
}
