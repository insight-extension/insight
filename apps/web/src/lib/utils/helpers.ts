import { PublicKey } from "@solana/web3.js";

export const formatPublicKey = (publicKey: PublicKey, visibleNumber = 4) =>
  publicKey.toBase58().slice(0, visibleNumber) +
  ".." +
  publicKey.toBase58().slice(-visibleNumber);
