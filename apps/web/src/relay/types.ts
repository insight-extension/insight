import {
    type DepositToken,
    type SubscriptionType,
} from "@repo/shared/constants";

export enum RelayRoute {
    DEPOSIT = "deposit",
    BALANCE = "balance",
    AUTH_TOKENS = "authTokens",
}

export enum RelayStatus {
    SUCCESS = "success",
    PARSE_ERROR = "parseError",
    ERROR = "error",
}

export interface RelayResponse {
    status: RelayStatus;
}

export interface DepositMessage {
    amount: number;
    token: DepositToken;
    subscriptionType: SubscriptionType;
    transactionSignature: string;
}
