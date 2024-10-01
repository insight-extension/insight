import { AnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

export interface ClickerGameObject {
  publicKey: PublicKey; // game's key
  account: {
    player: PublicKey; // player's key
    clicks: number; // total clicks
  };
}

export interface WalletAndNetwork {
  wallet: AnchorWallet;
  endpoint: string;
}

export interface WalletAndGamePublicKey {
  wallet: AnchorWallet;
  endpoint: string;
  gameAccountPublicKey: string;
}

export interface GameState {
  clicks: number;
  gameAccountPublicKey: string;
  isReady: boolean;
  errorMessage: string;
}

export interface LeaderboardItem {
  playerPublicKey: string;
  clicks: number;
}
