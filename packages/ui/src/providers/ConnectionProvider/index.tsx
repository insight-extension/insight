"use client";

import { ConnectionProvider as BaseConnectionProvider } from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import { PropsWithChildren, useMemo } from "react";

import { SOLANA_NETWORK } from "@repo/shared/configs";

export const ConnectionProvider = ({ children }: PropsWithChildren) => {
  // can provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(SOLANA_NETWORK), []);

  return (
    <BaseConnectionProvider endpoint={endpoint}>
      {children}
    </BaseConnectionProvider>
  );
};
