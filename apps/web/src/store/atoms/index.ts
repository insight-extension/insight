import { AnchorProvider, BN } from "@coral-xyz/anchor";
import { atom } from "jotai";

import { SPLToken } from "@repo/shared/constants";

export const anchorProviderAtom = atom<AnchorProvider | null>(null);

// todo: review
export const onDepositFunctionAtom = atom<
  (({ amount, token }: { amount: BN; token: SPLToken }) => Promise<void>) | null
>(async () => {
  throw new Error("Cannot deposit!");
});

export const onConnectWalletAtom = atom<((() => void) | undefined) | null>(
  () => {}
);

export const authenticationErrorMessageAtom = atom<string | null>(null);

export const walletsModalVisibilityAtom = atom<boolean>(false);
export const walletSelectionAtom = atom<boolean>(false);
