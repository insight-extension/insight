"use client";

import { WalletModalProvider as BaseWalletModalProvide } from "@solana/wallet-adapter-react-ui";
import { PropsWithChildren } from "react";

export const WalletModalProvider = ({ children }: PropsWithChildren) => {
  return <BaseWalletModalProvide>{children}</BaseWalletModalProvide>;
};
