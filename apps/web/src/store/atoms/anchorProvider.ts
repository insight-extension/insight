import { atom } from "jotai";
import { AnchorProvider } from "@coral-xyz/anchor";

export const anchorProviderAtom = atom<AnchorProvider | null>(null);
