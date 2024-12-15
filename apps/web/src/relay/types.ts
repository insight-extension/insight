import { DepositToken, SubscriptionType } from "@/constants";

export enum RelayRoute {
    DEPOSIT = "deposit",
    BALANCE = "balance",
}

export enum RelayStatus {
    SUCCESS = "success",
    PARSE_ERROR = "parseError",
    ERROR = "error",
}

export interface RelayResponse {
    status: RelayStatus;
}

export interface BalanceMessage {
    amount: number;
    token: DepositToken;
}

export interface DepositMessage extends BalanceMessage {
    subscriptionType: SubscriptionType;
    transactionSignature: string;
}
