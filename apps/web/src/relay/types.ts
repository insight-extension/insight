import { DepositToken, SubscriptionType } from "@/constants";

export enum RelayStatus {
    SUCCESS = "success",
    PARSE_ERROR = "parseError",
    ERROR = "error",
}

export interface RelayResponse {
    status: RelayStatus;
}

export interface DepositMessage {
    subscriptionType: SubscriptionType;
    amount: number;
    transactionSignature: string;
}

export interface BalanceMessage {
    amount: number;
    token: DepositToken;
}
