"use client";

import { WalletProvider as BaseWalletProvider } from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { PropsWithChildren, useMemo } from "react";

import { SOLANA_NETWORK } from "@repo/shared/configs";

export const WalletProvider = ({ children }: PropsWithChildren) => {
  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network: SOLANA_NETWORK }),
      new TorusWalletAdapter(),
    ],
    []
  );

  return (
    <BaseWalletProvider wallets={wallets} autoConnect>
      {children}
    </BaseWalletProvider>
  );
};
