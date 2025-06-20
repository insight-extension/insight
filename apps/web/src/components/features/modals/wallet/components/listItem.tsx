import type { FC, MouseEventHandler } from "react";

import { WalletReadyState } from "@solana/wallet-adapter-base";
import type { Wallet } from "@solana/wallet-adapter-react";

import { Button, WalletIcon } from ".";

export interface WalletListItemProps {
  handleClick: MouseEventHandler<HTMLButtonElement>;
  tabIndex?: number;
  wallet: Wallet;
}

export const WalletListItem: FC<WalletListItemProps> = ({
  handleClick,
  tabIndex,
  wallet
}) => {
  return (
    <li>
      <Button
        onClick={handleClick}
        startIcon={<WalletIcon wallet={wallet} />}
        tabIndex={tabIndex}>
        {wallet.adapter.name}
        {wallet.readyState === WalletReadyState.Installed && (
          <span>Detected</span>
        )}
      </Button>
    </li>
  );
};
