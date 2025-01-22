import { useCallback } from "react";

import { useWallet } from "@solana/wallet-adapter-react";
import { left, right, tryCatch } from "fp-ts/lib/TaskEither";
import { fold } from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";

import { SessionToken } from "@repo/shared/constants";

import { WalletDisconnectionError } from "@/errors";
import { sessionManager } from "@/services/session";

export const useLogout = ({ withReload = true }: { withReload?: boolean }) => {
  const { disconnect } = useWallet();

  const handleLogout = useCallback(() => {
    pipe(
      tryCatch(
        async () => await disconnect(),

        () => new WalletDisconnectionError()
      ),
      fold(
        () => left(location.reload()),
        () => {
          sessionManager.removeToken({ key: SessionToken.ACCESS });
          sessionManager.removeToken({ key: SessionToken.REFRESH });

          if (withReload) {
            location.reload();
          }

          return right(void 0);
        }
      )
    )();
  }, [disconnect]);

  return {
    logout: handleLogout
  };
};
