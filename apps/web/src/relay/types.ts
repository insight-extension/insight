import { DepositToken, SubscriptionType } from "@/constants";
import { AuthTokens } from "@/services/auth/types";

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

export interface BalanceMessage {
    amount: number;
    token: DepositToken;
}

export interface DepositMessage extends BalanceMessage {
    subscriptionType: SubscriptionType;
    transactionSignature: string;
}

export interface AuthTokensMessage extends AuthTokens {}
