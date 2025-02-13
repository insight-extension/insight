import { PropsWithChildren, useMemo } from "react";

import {
  ConnectionProvider as BaseConnectionProvider,
  WalletProvider as BaseWalletProvider
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

import { SOLANA_NETWORK } from "@repo/shared/constants";

export const WalletAdapterProvider = ({ children }: PropsWithChildren) => {
  /**
   * Wallets that implement either of these standards will be available automatically.
   *
   *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
   *     (https://github.com/solana-mobile/mobile-wallet-adapter)
   *   - Solana Wallet Standard
   *     (https://github.com/anza-xyz/wallet-standard)
   *
   * If you wish to support a wallet that supports neither of those standards,
   * instantiate its legacy wallet adapter here. Common legacy adapters can be found
   * in the npm package `@solana/wallet-adapter-wallets`.
   */
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network: SOLANA_NETWORK }),
      new TorusWalletAdapter()
    ],
    []
  );

  const endpoint = useMemo(() => clusterApiUrl(SOLANA_NETWORK), []);

  return (
    <BaseConnectionProvider endpoint={endpoint}>
      <BaseWalletProvider wallets={wallets} autoConnect>
        {children}
      </BaseWalletProvider>
    </BaseConnectionProvider>
  );
};
