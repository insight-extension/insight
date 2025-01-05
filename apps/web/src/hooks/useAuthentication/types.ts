import { PublicKey } from "@solana/web3.js";

export interface UseAuthentication {
  authenticate: ({
    publicKey,
    signMessage
  }: {
    publicKey: PublicKey;
    signMessage: (message: Uint8Array) => Promise<Uint8Array>;
  }) => void;
  tokenRefresh: () => void;
  errorMessage: string | null;
  onErrorMessage: (errorMessage: string | null) => void;
}
