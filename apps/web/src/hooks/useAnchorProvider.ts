import { useSetAtom } from "jotai";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { AnchorProvider } from "@coral-xyz/anchor";
import { useEffect } from "react";

import { anchorProviderAtom } from "@/store";

export const useAnchorProvider = () => {
    const { connection } = useConnection();
    const setAnchorProvider = useSetAtom(anchorProviderAtom);

    const wallet = useAnchorWallet();

    useEffect(() => {
        if (connection && wallet) {
            setAnchorProvider(new AnchorProvider(connection, wallet));
        }
    }, [connection, wallet]);
};
