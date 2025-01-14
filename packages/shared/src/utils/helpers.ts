import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

import { ROOT_DOMAIN_PATTERN } from "@repo/shared/constants";

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

export const createAuthorizationHeader = (accessToken: string): string =>
  `Bearer ${accessToken}`;

export const getDecimalMultiplier = (decimals: number) => 10 ** decimals;

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
