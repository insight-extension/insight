import { WalletError } from "@solana/wallet-adapter-base";

export class WalletConnectionError extends WalletError {
  name = "WalletConnectionError";
  message = "Failed to connect to wallet.";
}

export class WalletDisconnectionError extends WalletError {
  name = "WalletDisconnectionError";
  message = "Failed to disconnect wallet.";
}
