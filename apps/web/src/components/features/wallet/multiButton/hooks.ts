import { useWallet, type Wallet } from "@solana/wallet-adapter-react";
import type { PublicKey } from "@solana/web3.js";
import { useCallback, useMemo } from "react";
import { match, P } from "ts-pattern";

import { WalletButtonState } from "./types";

interface WalletMultiButtonState {
    buttonState: WalletButtonState;
    onConnect?: () => void;
    onDisconnect?: () => void;
    onSelectWallet?: () => void;
    publicKey?: PublicKey;
    walletIcon?: Wallet["adapter"]["icon"];
    walletName?: Wallet["adapter"]["name"];
}

interface Config {
    onSelectWallet: (config: {
        onSelectWallet: (walletName: Wallet["adapter"]["name"]) => void;
        wallets: Wallet[];
    }) => void;
}

export const useWalletMultiButton = ({
    onSelectWallet,
}: Config): WalletMultiButtonState => {
    const {
        connect,
        connected,
        connecting,
        disconnect,
        disconnecting,
        publicKey,
        select,
        wallet,
        wallets,
    } = useWallet();
    const buttonState = useMemo(
        () =>
            match({
                wallet,
                connecting,
                connected,
                disconnecting,
            })
                .with({ connecting: true }, () => WalletButtonState.CONNECTING)
                .with({ connected: true }, () => WalletButtonState.CONNECTED)
                .with(
                    { disconnecting: true },
                    () => WalletButtonState.DISCONNECTING
                )
                .with(
                    { wallet: P.nonNullable },
                    () => WalletButtonState.HAS_WALLET
                )
                .otherwise(() => WalletButtonState.NO_WALLET),
        [wallet, connecting, connected, disconnecting]
    );

    const handleConnect = useCallback(() => {
        connect().catch(() => {
            // Silently catch because any errors are caught by the context `onError` handler
        });
    }, [connect]);

    const handleDisconnect = useCallback(() => {
        disconnect().catch(() => {
            // Silently catch because any errors are caught by the context `onError` handler
        });
    }, [disconnect]);

    const handleSelectWallet = useCallback(() => {
        onSelectWallet({ onSelectWallet: select, wallets });
    }, [onSelectWallet, select, wallets]);

    return {
        buttonState,
        onConnect:
            buttonState === WalletButtonState.HAS_WALLET
                ? handleConnect
                : undefined,
        onDisconnect:
            buttonState !== WalletButtonState.DISCONNECTING &&
            buttonState !== WalletButtonState.NO_WALLET
                ? handleDisconnect
                : undefined,
        onSelectWallet: handleSelectWallet,
        publicKey: publicKey ?? undefined,
        walletIcon: wallet?.adapter.icon,
        walletName: wallet?.adapter.name,
    };
};
