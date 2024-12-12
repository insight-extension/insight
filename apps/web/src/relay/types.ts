import { BN } from "@coral-xyz/anchor";

import { SubscriptionType } from "@/constants";

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
    amount: BN;
    transactionSignature: string;
}
