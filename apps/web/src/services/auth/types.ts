import { PublicKey } from "@solana/web3.js";

export interface AuthPublicKey {
    publicKey: PublicKey;
}

export interface AuthClaimNonce {
    publicKey: string;
}

export interface AuthNonce {
    nonce: string;
    publicKey: string;
}

export interface AuthVerifyAccount {
    publicKey: string;
    signature: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthRefreshToken {
    refreshToken: string;
}

export interface AuthCreateSignature extends Omit<AuthNonce, "publicKey"> {
    signMessageFn: (message: Uint8Array) => Promise<Uint8Array>;
}

export interface AuthSignature {
    signature: string;
}
