import { BN } from "@coral-xyz/anchor";

import { ROOT_DOMAIN_PATTERN, TOKEN_CURRENCIES } from "@repo/shared/constants";

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

export const numberToBN = (amount: number, decimals: number): BN =>
  new BN(amount * 10 ** decimals);
