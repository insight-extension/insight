import { WalletError } from "@solana/wallet-adapter-base";

export class TokenAccountNotFoundError extends WalletError {
    name = "TokenAccountNotFoundError";
    message = "Account for requested token not found, please create one.";
}

export class SessionExpiredError extends WalletError {
    name = "SessionExpiredError";
    message = "Your session has expired, please login again.";
}
