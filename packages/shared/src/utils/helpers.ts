import { BN } from "@coral-xyz/anchor";
import {
  ROOT_DOMAIN_PATTERN,
  SOLANA_EXPLORER_URL,
  SOLANA_NETWORK
} from "@shared/constants";
import { PublicKey } from "@solana/web3.js";

export const isServerSide = typeof window === "undefined";

export const extractDomainFromURL = (url: string): string | null => {
  try {
    const { hostname } = new URL(url);

    return hostname ?? null;
  } catch {
    return null;
  }
};

export const extractRootDomainFromURL = (url: string): string | null =>
  extractDomainFromURL(url)?.match(ROOT_DOMAIN_PATTERN)?.[0] ?? null;

export const getDecimalMultiplier = (decimals: number) => 10 ** decimals;

export const convertNumberToBN = (value: number): BN => new BN(value);

export const convertNumberToBNWithDecimals = (
  value: number,
  decimals: number
): BN => new BN(value * getDecimalMultiplier(decimals));

export const convertBNToNumberWithDecimals = (
  value: BN,
  decimals: number
): number => Number(value) / getDecimalMultiplier(decimals);

export const roundToDecimals = (value: number, decimals = 1): number =>
  Math.round(value * 10 ** decimals) / 10 ** decimals;

export const formatPublicKey = (key: PublicKey | string, visibleNumber = 4) => {
  let publicKey = typeof key === "string" ? new PublicKey(key) : key;

  return (
    publicKey.toBase58().slice(0, visibleNumber) +
    ".." +
    publicKey.toBase58().slice(-visibleNumber)
  );
};

export const roundToDecimal = (value: number, decimals: number = 0): number => {
  const factor = Math.pow(10, decimals);

  return Math.floor(value * factor) / factor;
};

export const getSOlExplorerTransactionURL = (address: string) => {
  return `${SOLANA_EXPLORER_URL}/tx/${address}?cluster=${SOLANA_NETWORK}`;
};
