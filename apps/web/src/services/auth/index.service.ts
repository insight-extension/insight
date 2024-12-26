import bs58 from "bs58";

import type {
    AuthClaimNonce,
    AuthCreateSignature,
    AuthNonce,
    AuthPublicKey,
    AuthRefreshToken,
    AuthSignature,
    AuthTokens,
    AuthVerifyAccount,
} from "./types";
import { jsonHTTPClient } from "../../http/client";
import { AuthTokensSchema, ClaimNonceSchema } from "./validation";
import { FetchResult, parseResponse, throwErrorResponse } from "../../http";

class AuthService {
    private baseURL = "/auth";

    private getURL(url: string) {
        return this.baseURL + url;
    }

    public claimNonce = async ({
        publicKey,
    }: AuthPublicKey): Promise<FetchResult<AuthNonce | null>> => {
        try {
            const publicKeyBase58 = publicKey.toBase58();

            const response = await jsonHTTPClient.post<
                AuthClaimNonce,
                AuthNonce
            >(this.getURL("/claim"), {
                publicKey: publicKeyBase58,
            });

            return parseResponse(response, ClaimNonceSchema);
        } catch (error: any) {
            return throwErrorResponse(error);
        }
    };

    public verifyAccount = async ({
        publicKey,
        signature,
    }: AuthPublicKey & AuthSignature): Promise<
        FetchResult<AuthTokens | null>
    > => {
        try {
            const publicKeyBase58 = publicKey.toBase58();

            const response = await jsonHTTPClient.post<
                AuthVerifyAccount,
                AuthTokens
            >(this.getURL("/verify"), {
                publicKey: publicKeyBase58,
                signature,
            });

            return parseResponse(response, AuthTokensSchema);
        } catch (error: any) {
            return throwErrorResponse(error);
        }
    };

    public refreshToken = async ({
        refreshToken,
    }: AuthRefreshToken): Promise<FetchResult<AuthTokens>> => {
        try {
            const response = await jsonHTTPClient.post<
                AuthRefreshToken,
                AuthTokens
            >(this.getURL("/refresh-token"), {
                refreshToken,
            });

            return parseResponse(response, AuthTokensSchema);
        } catch (error: any) {
            return throwErrorResponse(error);
        }
    };

    public createSignature = async ({
        nonce,
        signMessageFn,
    }: AuthCreateSignature): Promise<AuthSignature | null> => {
        try {
            const encodedNonce = new TextEncoder().encode(nonce);

            const signedMessage = await signMessageFn(encodedNonce);

            const signature = bs58.encode(signedMessage);

            return { signature };
        } catch (error) {
            throw error;
        }
    };
}

export const authService = new AuthService();
