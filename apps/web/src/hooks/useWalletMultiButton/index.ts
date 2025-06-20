import { useMemo } from "react";
import { useCookies } from "react-cookie";

import { useWallet } from "@solana/wallet-adapter-react";
import { useAtomValue } from "jotai";
import { P, match } from "ts-pattern";

import { SessionToken } from "@repo/shared/constants";

import { authenticationErrorMessageAtom } from "@/store";

import { UseWalletMultiButton, WalletButtonState } from "./types";

export const useWalletMultiButton = (): UseWalletMultiButton => {
  const [cookies = null] = useCookies([SessionToken.ACCESS]);

  const { connecting, connected, disconnecting, publicKey, wallet } =
    useWallet();

  const errorMessage = useAtomValue(authenticationErrorMessageAtom);

  const walletState = useMemo(
    () =>
      match({
        wallet,
        connecting,
        connected,
        disconnecting,
        cookies,
        errorMessage
      })
        .with(
          {
            errorMessage: P.nonNullable
          },
          () => WalletButtonState.CONNECTING
        )
        .with(
          {
            connected: true,
            cookies: {
              accessToken: P.nonNullable
            }
          },
          () => WalletButtonState.CONNECTED
        )
        .with({ connecting: true }, () => WalletButtonState.CONNECTING)
        .with({ disconnecting: true }, () => WalletButtonState.DISCONNECTING)
        .with({ wallet: P.nonNullable }, () => WalletButtonState.HAS_WALLET)
        .otherwise(() => WalletButtonState.NO_WALLET),
    [wallet, connecting, connected, disconnecting, cookies, errorMessage]
  );

  return useMemo(
    () => ({
      walletState,
      publicKey: publicKey ?? undefined,
      walletIcon: wallet?.adapter.icon,
      walletName: wallet?.adapter.name
    }),
    [walletState, publicKey, wallet]
  );
};

export * from "./types";
