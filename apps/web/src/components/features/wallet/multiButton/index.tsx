import {
  HTMLAttributes,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { useIntl } from "react-intl";

import { PublicKey } from "@solana/web3.js";
import debounce from "debounce";
import { useAtom } from "jotai";
import { P, match } from "ts-pattern";

import { formatPublicKey } from "@repo/shared/utils";

import { DepositModal, DialogTrigger, WalletModal } from "@/components";
import { WalletButtonState, useLogout, useWalletMultiButton } from "@/hooks";
import { walletsModalVisibilityAtom } from "@/store";

import { BaseWalletConnectionButton } from "./base";
import { WalletButtonLabel } from "./types";

interface WalletMultiButtonProps extends HTMLAttributes<HTMLButtonElement> {
  namespace?: string;
}

export const WalletMultiButton: React.FC<WalletMultiButtonProps> = memo(
  ({ namespace = "features.wallet.multiButton", ...props }) => {
    const intl = useIntl();

    const [isModalVisible, setIsModalVisible] = useAtom(
      walletsModalVisibilityAtom
    );

    const { walletState, publicKey, walletIcon, walletName } =
      useWalletMultiButton();

    const { logout } = useLogout({ withReload: false });

    const [iscopied, setIsCopied] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const menuRef = useRef<HTMLUListElement | null>(null);

    const content = useMemo(
      () =>
        match({
          publicKey,
          walletState
        })
          .returnType<string>()
          .with(
            {
              walletState: WalletButtonState.CONNECTED,
              publicKey: P.intersection(P.instanceOf(PublicKey), P.select())
            },
            (key) => formatPublicKey(key)
          )
          .with(
            {
              walletState: P.not(WalletButtonState.CONNECTED),
              publicKey: P.instanceOf(PublicKey)
            },
            () =>
              intl.formatMessage({
                id: `${namespace}.${WalletButtonLabel.CONNECTING}`
              })
          )
          .with(
            {
              walletState: WalletButtonState.CONNECTING
            },
            () =>
              intl.formatMessage({
                id: `${namespace}.${WalletButtonLabel.CONNECTING}`
              })
          )
          .with(
            {
              walletState: WalletButtonState.HAS_WALLET
            },
            () =>
              intl.formatMessage({
                id: `${namespace}.${WalletButtonLabel.HAS_WALLET}`
              })
          )
          .otherwise(() =>
            intl.formatMessage({
              id: `${namespace}.${WalletButtonLabel.NO_WALLET}`
            })
          ),
      [walletState, publicKey]
    );

    const handleClick = useCallback(
      () =>
        match(walletState)
          .with(WalletButtonState.NO_WALLET, () => setIsModalVisible(true))
          .with(WalletButtonState.HAS_WALLET, () => setIsModalVisible(true))
          .with(WalletButtonState.CONNECTED, () => setIsMenuOpen(true))
          .otherwise(() => {}),
      [walletState]
    );

    const handleDisconnect = useCallback(() => {
      logout();

      setIsMenuOpen(false);
    }, [logout]);

    const handleCopy = useCallback(async () => {
      if (!publicKey) return;

      await navigator.clipboard.writeText(publicKey.toBase58());

      setIsCopied(true);

      debounce(() => setIsCopied(false), 400)();
    }, []);

    const handleOpenWallets = useCallback(() => {
      setIsModalVisible(true);
      setIsMenuOpen(false);
    }, []);

    useEffect(() => {
      const mouseOrTouchListener = (event: MouseEvent | TouchEvent) => {
        const node = menuRef.current;

        // Do nothing if clicking dropdown or its descendants
        if (!node || node.contains(event.target as Node)) {
          return;
        }

        setIsMenuOpen(false);
      };

      document.addEventListener("mousedown", mouseOrTouchListener);
      document.addEventListener("touchstart", mouseOrTouchListener);

      return () => {
        document.removeEventListener("mousedown", mouseOrTouchListener);
        document.removeEventListener("touchstart", mouseOrTouchListener);
      };
    }, []);

    return (
      <div className="wallet-adapter-dropdown">
        <BaseWalletConnectionButton
          {...props}
          aria-expanded={isMenuOpen}
          style={{
            pointerEvents: isMenuOpen ? "none" : "auto",
            ...props.style
          }}
          onClick={handleClick}
          walletIcon={walletIcon}
          walletName={walletName}
          isHighlighted={walletState !== WalletButtonState.CONNECTED}>
          {content}
        </BaseWalletConnectionButton>

        <ul
          aria-label="dropdown-list"
          className={`wallet-adapter-dropdown-list ${isMenuOpen && "wallet-adapter-dropdown-list-active"}`}
          ref={menuRef}
          role="menu">
          {publicKey && (
            <>
              <DepositModal
                isDefaultOpen
                trigger={
                  <DialogTrigger className="wallet-adapter-dropdown-list-item text-dark bg-green-300 hover:text-white">
                    Deposit
                  </DialogTrigger>
                }
              />

              <li
                className="wallet-adapter-dropdown-list-item"
                onClick={handleCopy}
                role="menuitem">
                {intl.formatMessage({
                  id: `${namespace}.${iscopied ? WalletButtonLabel.COPIED : WalletButtonLabel.COPY_ADDRESS}`
                })}
              </li>
            </>
          )}

          <li
            className="wallet-adapter-dropdown-list-item"
            onClick={handleOpenWallets}
            role="menuitem">
            {intl.formatMessage({
              id: `${namespace}.${WalletButtonLabel.CHANGE_WALLET}`
            })}
          </li>

          {walletState === WalletButtonState.CONNECTED && (
            <li
              className="wallet-adapter-dropdown-list-item"
              onClick={handleDisconnect}
              role="menuitem">
              {intl.formatMessage({
                id: `${namespace}.${WalletButtonLabel.DISCONNECT}`
              })}
            </li>
          )}
        </ul>

        {isModalVisible && <WalletModal />}
      </div>
    );
  }
);
