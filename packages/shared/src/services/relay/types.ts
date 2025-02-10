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
  token: string;
  // subscriptionType: SubscriptionType;
  transactionSignature: string;
}
