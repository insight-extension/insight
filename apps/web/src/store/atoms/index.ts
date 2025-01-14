import { atom } from "jotai";

import { AnchorProvider } from "@repo/shared/anchor";
import { SPLToken } from "@repo/shared/constants";
import { BN } from "@repo/shared/utils";

export const anchorProviderAtom = atom<AnchorProvider | null>(null);

// unused
export const onDepositFunctionAtom = atom<
  (({ amount, token }: { amount: BN; token: SPLToken }) => Promise<void>) | null
>(async () => {
  throw new Error("Cannot deposit!");
});

export const authenticationErrorMessageAtom = atom<string | null>(null);

export const walletsModalVisibilityAtom = atom<boolean>(false);
export const walletSelectionAtom = atom<boolean>(false);
