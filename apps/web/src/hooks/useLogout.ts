import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback } from "react";

import { sessionManager } from "@/session";
import { SessionToken } from "@/constants";

export const useLogout = () => {
    const { disconnect } = useWallet();

    return useCallback(() => {
        sessionManager.removeToken({ key: SessionToken.ACCESS });
        sessionManager.removeToken({ key: SessionToken.REFRESH });

        disconnect();

        window.location.reload();
    }, [disconnect]);
};
