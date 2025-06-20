import { Wallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

export enum WalletButtonState {
  CONNECTING = "connecting",
  CONNECTED = "connected",
  DISCONNECTING = "disconnecting",
  HAS_WALLET = "has-wallet",
  NO_WALLET = "no-wallet"
}

export interface UseWalletMultiButton {
  walletState: WalletButtonState;
  publicKey?: PublicKey;
  walletIcon?: Wallet["adapter"]["icon"];
  walletName?: Wallet["adapter"]["name"];
}
