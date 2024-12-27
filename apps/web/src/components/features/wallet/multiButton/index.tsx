import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import {
    HTMLAttributes,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    memo,
} from "react";
import { PublicKey } from "@solana/web3.js";
import { match, P } from "ts-pattern";
import { useIntl } from "react-intl";
import debounce from "debounce";

import { DepositModal, DialogTrigger } from "@/components";
import { SessionToken } from "@repo/shared/constants";
import { formatPublicKey, isTokenExpired } from "@/lib";

import { BaseWalletConnectionButton } from "./base";
import { WalletButtonLabel, WalletButtonState } from "./types";
import { useWalletMultiButton } from "./hooks";
import { useLogout } from "@/hooks";
import { sessionManager } from "@/services/session";

interface WalletMultiButtonProps extends HTMLAttributes<HTMLButtonElement> {
    namespace?: string;
}

// todo: auth action must be with wallet actions
export const WalletMultiButton: React.FC<WalletMultiButtonProps> = memo(
    ({ namespace = "features.wallet.multiButton", ...props }) => {
        const intl = useIntl();
        // const [{ accessToken }] = useCookies<string>([SessionToken.ACCESS], {
        //     doNotParse: true,
        // });
        const accessToken = sessionManager.getToken({
            key: SessionToken.ACCESS,
        });
        const { setVisible: setModalVisible } = useWalletModal();
        const logout = useLogout();

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

        const [copied, setCopied] = useState<boolean>(false);
        const [menuOpen, setMenuOpen] = useState<boolean>(false);
        const [isAuthenticationRequired, _setIsAuthenticationRequired] =
            useState<boolean>(false);
        const ref = useRef<HTMLUListElement>(null);

        const content = useMemo(() => {
            //todo: complete
            const shouldAuthenticate =
                buttonState === WalletButtonState.CONNECTED &&
                isTokenExpired({
                    token: accessToken,
                });

            // setIsAuthenticationRequired(shouldAuthenticate);

            return (
                match({
                    publicKey,
                    buttonState,
                    shouldAuthenticate,
                })
                    .returnType<string | ReactNode>()
                    // .with(
                    //     {
                    //          shouldAuthenticate: true,
                    //     },
                    //     () =>
                    //         intl.formatMessage({
                    //             id: `${namespace}.${WalletButtonLabel.AUTHENTICATION_REQUIRED}`,
                    //         })
                    // )
                    .with(
                        {
                            publicKey: P.intersection(
                                P.instanceOf(PublicKey),
                                P.select()
                            ),
                        },
                        (publicKey) => formatPublicKey(publicKey)
                    )
                    .with(
                        {
                            buttonState: WalletButtonState.CONNECTING,
                        },
                        () =>
                            intl.formatMessage({
                                id: `${namespace}.${WalletButtonLabel.CONNECTING}`,
                            })
                    )
                    .with(
                        {
                            buttonState: WalletButtonState.HAS_WALLET,
                        },
                        () =>
                            intl.formatMessage({
                                id: `${namespace}.${WalletButtonLabel.HAS_WALLET}`,
                            })
                    )
                    .otherwise(() =>
                        intl.formatMessage({
                            id: `${namespace}.${WalletButtonLabel.NO_WALLET}`,
                        })
                    )
            );
        }, [buttonState, publicKey, accessToken]);

        const handleClick = useCallback(() => {
            match(buttonState)
                .with(WalletButtonState.NO_WALLET, () => setModalVisible(true))
                .with(
                    WalletButtonState.HAS_WALLET,
                    () => onConnect && onConnect()
                )
                .with(WalletButtonState.CONNECTED, () => setMenuOpen(true));
        }, [buttonState, onConnect]);

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

        return (
            <div className="wallet-adapter-dropdown">
                <BaseWalletConnectionButton
                    {...props}
                    aria-expanded={menuOpen}
                    style={{
                        pointerEvents: menuOpen ? "none" : "auto",
                        ...props.style,
                    }}
                    onClick={handleClick}
                    walletIcon={walletIcon}
                    walletName={walletName}
                    isHighlighted={isAuthenticationRequired}
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

                                debounce(() => setCopied(false), 400)();
                            }}
                            role="menuitem"
                        >
                            {intl.formatMessage({
                                id: `${namespace}.${copied ? WalletButtonLabel.COPIED : WalletButtonLabel.COPY_ADDRESS}`,
                            })}
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
                        {intl.formatMessage({
                            id: `${namespace}.${WalletButtonLabel.CHANGE_WALLET}`,
                        })}
                    </li>

                    {onDisconnect ? (
                        <li
                            className="wallet-adapter-dropdown-list-item"
                            onClick={() => {
                                onDisconnect();

                                setMenuOpen(false);

                                logout();
                            }}
                            role="menuitem"
                        >
                            {intl.formatMessage({
                                id: `${namespace}.${WalletButtonLabel.DISCONNECT}`,
                            })}
                        </li>
                    ) : null}
                </ul>
            </div>
        );
    }
);
