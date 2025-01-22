import { useEffect } from "react";

import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useSetAtom } from "jotai";

import { AnchorProvider } from "@repo/shared/anchor";

import { anchorProviderAtom } from "@/store";

export const useSetupAnchorProvider = () => {
  const { connection } = useConnection();

  const setAnchorProvider = useSetAtom(anchorProviderAtom);

  const wallet = useAnchorWallet();

  useEffect(() => {
    if (connection && wallet) {
      setAnchorProvider(new AnchorProvider(connection, wallet));
    }
  }, [connection, wallet]);
};
