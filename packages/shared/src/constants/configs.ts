import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";

// Can be set to 'devnet', 'testnet', or 'mainnet-beta'
export const SOLANA_NETWORK = WalletAdapterNetwork.Devnet;

export const SOLANA_CLUSTER_URL = clusterApiUrl(SOLANA_NETWORK);
