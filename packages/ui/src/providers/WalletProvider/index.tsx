"use client";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletProvider as BaseWalletProvider } from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { PropsWithChildren, useMemo } from "react";

export const WalletProvider = ({ children }: PropsWithChildren) => {
  const network = WalletAdapterNetwork.Devnet;

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
    ],
    [network]
  );

  return (
    <BaseWalletProvider wallets={wallets} autoConnect>
      {children}
    </BaseWalletProvider>
  );
};
