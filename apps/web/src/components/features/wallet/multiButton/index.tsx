import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWalletMultiButton } from "@solana/wallet-adapter-base-ui";
import { HTMLAttributes, useEffect, useMemo, useRef, useState } from "react";

import { DepositModal, DialogTrigger } from "@/components";

import { BaseWalletConnectionButton } from "./base";

const LABELS = {
    "change-wallet": "Change wallet",
    connecting: "Connecting ...",
    "copy-address": "Copy address",
    copied: "Copied",
    disconnect: "Disconnect",
    "has-wallet": "Connect",
    "no-wallet": "Connect Wallet",
} as const;

interface WalletMultiButtonProps extends HTMLAttributes<HTMLButtonElement> {}

export const WalletMultiButton: React.FC<WalletMultiButtonProps> = ({
    children,
    ...props
}) => {
    const { setVisible: setModalVisible } = useWalletModal();
    const {
        buttonState,
        onConnect,
        onDisconnect,
        publicKey,
        walletIcon,
        walletName,
    } = useWalletMultiButton({
        onSelectWallet() {
            setModalVisible(true);
        },
    });

    const [copied, setCopied] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const ref = useRef<HTMLUListElement>(null);

    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            const node = ref.current;

            // Do nothing if clicking dropdown or its descendants
            if (!node || node.contains(event.target as Node)) {
                return;
            }

            setMenuOpen(false);
        };

        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);

        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, []);

    const content = useMemo(() => {
        if (children) {
            return children;
        } else if (publicKey) {
            const base58 = publicKey.toBase58();
            return base58.slice(0, 4) + ".." + base58.slice(-4);
        } else if (
            buttonState === "connecting" ||
            buttonState === "has-wallet"
        ) {
            return LABELS[buttonState];
        } else {
            return LABELS["no-wallet"];
        }
    }, [buttonState, children, LABELS, publicKey]);

    return (
        <div className="wallet-adapter-dropdown">
            <BaseWalletConnectionButton
                {...props}
                aria-expanded={menuOpen}
                style={{
                    pointerEvents: menuOpen ? "none" : "auto",
                    ...props.style,
                }}
                onClick={() => {
                    switch (buttonState) {
                        case "no-wallet":
                            setModalVisible(true);
                            break;
                        case "has-wallet":
                            if (onConnect) {
                                onConnect();
                            }
                            break;
                        case "connected":
                            setMenuOpen(true);
                            break;
                    }
                }}
                walletIcon={walletIcon}
                walletName={walletName}
            >
                {content}
            </BaseWalletConnectionButton>

            <ul
                aria-label="dropdown-list"
                className={`wallet-adapter-dropdown-list ${menuOpen && "wallet-adapter-dropdown-list-active"}`}
                ref={ref}
                role="menu"
            >
                {publicKey && (
                    <DepositModal
                        isDefaultOpen
                        trigger={
                            <DialogTrigger className="wallet-adapter-dropdown-list-item bg-green-300 text-dark hover:text-white">
                                Deposit
                            </DialogTrigger>
                        }
                    />
                )}

                {publicKey ? (
                    <li
                        className="wallet-adapter-dropdown-list-item"
                        onClick={async () => {
                            await navigator.clipboard.writeText(
                                publicKey.toBase58()
                            );
                            setCopied(true);
                            setTimeout(() => setCopied(false), 400);
                        }}
                        role="menuitem"
                    >
                        {copied ? LABELS["copied"] : LABELS["copy-address"]}
                    </li>
                ) : null}

                <li
                    className="wallet-adapter-dropdown-list-item"
                    onClick={() => {
                        setModalVisible(true);
                        setMenuOpen(false);
                    }}
                    role="menuitem"
                >
                    {LABELS["change-wallet"]}
                </li>

                {onDisconnect ? (
                    <li
                        className="wallet-adapter-dropdown-list-item"
                        onClick={() => {
                            onDisconnect();
                            setMenuOpen(false);
                        }}
                        role="menuitem"
                    >
                        {LABELS["disconnect"]}
                    </li>
                ) : null}
            </ul>
        </div>
    );
};
