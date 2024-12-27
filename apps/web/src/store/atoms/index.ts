import { atom } from "jotai";
import { AnchorProvider, BN } from "@coral-xyz/anchor";

import { DepositToken } from "@repo/shared/constants";

export const anchorProviderAtom = atom<AnchorProvider | null>(null);

export const onDepositFunctionAtom = atom<
    | (({
          amount,
          token,
      }: {
          amount: BN;
          token: DepositToken;
      }) => Promise<void>)
    | null
>(async () => {
    throw new Error("Cannot deposit!");
});

export const onConnectWalletAtom = atom<((() => void) | undefined) | null>(
    () => {}
);
