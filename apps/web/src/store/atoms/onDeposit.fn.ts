import { atom } from "jotai";
import { BN } from "@coral-xyz/anchor";

import { DepositToken } from "@/onchain";

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
