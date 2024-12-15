import { WalletError } from "@solana/wallet-adapter-base";

export class TokenAccountNotFoundError extends WalletError {
    name = "TokenAccountNotFoundError";
    message = "Account for requested token not found, please create one.";
}
