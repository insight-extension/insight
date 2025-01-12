import { useCallback, useEffect, useRef, useState } from "react";

import { Connection, PublicKey } from "@solana/web3.js";

import { AnchorProvider } from "@repo/shared/anchor";
import {
  SOLANA_CLUSTER_URL,
  SPLToken,
  StorageKey,
  TOKEN_CURRENCIES
} from "@repo/shared/constants";
import { AnchorClient } from "@repo/shared/services";

import { storage } from "@/background";
import { sessionManager } from "@/session/manager";

interface UseTokenBalanceProps {
  accessToken: string | null;
  token?: SPLToken;
}

export const useTokenBalance = ({
  accessToken,
  // todo: make it dynamic from current user token
  token = TOKEN_CURRENCIES[SPLToken.USDC].symbol
}: UseTokenBalanceProps) => {
  const [balance, setBalance] = useState<number | null>(null);

  const anchorClientRef = useRef<AnchorClient | null>(null);

  const updateBalance = useCallback(async () => {
    const anchorClient = anchorClientRef.current;

    if (!anchorClient) return;

    setBalance(await anchorClient.getTokenBalance({ token }));
  }, [token]);

  useEffect(() => {
    const callbackMap = {
      [StorageKey.DEPOSIT]: updateBalance
    };

    storage.watch(callbackMap);

    return () => {
      storage.unwatch(callbackMap);
    };
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    (async () => {
      const publicKey = sessionManager.decodeToken(accessToken);

      const anchorClient = new AnchorClient(
        new AnchorProvider(new Connection(SOLANA_CLUSTER_URL), {
          publicKey: new PublicKey(publicKey),
          signTransaction: async (_) => _,
          signAllTransactions: async (_) => []
        })
      );

      anchorClientRef.current = anchorClient;

      await storage.set(StorageKey.PUBLIC_KEY, publicKey);

      await updateBalance();
    })();
  }, [accessToken]);

  return {
    balance
  };
};
