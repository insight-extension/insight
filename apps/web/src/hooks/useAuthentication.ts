import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useCallback, useEffect, useState } from "react";

import { SessionExpiredError } from "@/errors";
import { CacheKey, useMutation } from "@/fetching";
import { TRANSLATIONS } from "@/i18n";
import { isTokenExpired } from "@/lib";
import { authService } from "@/services";
import { sessionManager, TokenKey } from "@/session/manager.service";

export const useAuthentication = () => {
    const { publicKey, connected, signMessage } = useWallet();

    const [authenticationError, setAuthenticationError] = useState<
        string | null
    >(null);

    const accessToken = sessionManager.getToken({ key: TokenKey.ACCESS });
    const refreshToken = sessionManager.getToken({ key: TokenKey.REFRESH });

    const isUnauthenticated = !accessToken;
    const shouldRefreshToken = isTokenExpired(accessToken);

    const { trigger: claimNonce, error: claimNonceError } = useMutation({
        key: CacheKey.CLAIM_NONCE,
        mutateFn: authService.claimNonce,
    });

    const { trigger: verifyAccount, error: verifyAccountError } = useMutation({
        key: CacheKey.VERIFY_ACCOUNT,
        mutateFn: authService.verifyAccount,
    });

    const { trigger: refresh, error: refreshError } = useMutation({
        key: CacheKey.REFRESH_TOKEN,
        mutateFn: authService.refreshToken,
    });

    const handleTokenRefresh = useCallback(async () => {
        if (isTokenExpired(refreshToken) || !refreshToken) {
            throw new SessionExpiredError();
        }

        const { data: refreshTokenResponse } = await refresh({ refreshToken });

        if (refreshTokenResponse) {
            sessionManager.setToken({
                key: TokenKey.ACCESS,
                value: refreshTokenResponse.accessToken,
            });
            sessionManager.setToken({
                key: TokenKey.REFRESH,
                value: refreshTokenResponse.refreshToken,
            });
        }
    }, [refreshToken, refresh]);

    const handleSaveTokens = useCallback(
        async ({
            publicKey,
            signMessage,
        }: {
            publicKey: PublicKey;
            signMessage: (message: Uint8Array) => Promise<Uint8Array>;
        }) => {
            const { data: nonceResponse } = await claimNonce({ publicKey });

            if (!nonceResponse) {
                return;
            }

            const signatureResponse = await authService.createSignature({
                nonce: nonceResponse.nonce,
                signMessageFn: signMessage,
            });

            if (!signatureResponse) {
                setAuthenticationError(TRANSLATIONS.createSignatureError);

                return;
            }

            const { data: accountResponse } = await verifyAccount({
                publicKey,
                signature: signatureResponse.signature,
            });

            if (accountResponse) {
                sessionManager.setToken({
                    key: TokenKey.ACCESS,
                    value: accountResponse.accessToken,
                });
                sessionManager.setToken({
                    key: TokenKey.REFRESH,
                    value: accountResponse.refreshToken,
                });
            }
        },
        [claimNonce, verifyAccount]
    );

    useEffect(() => {
        if (shouldRefreshToken) {
            handleTokenRefresh().catch(() =>
                setAuthenticationError(TRANSLATIONS.unexpectedError)
            );
        }
    }, [shouldRefreshToken, handleTokenRefresh]);

    useEffect(() => {
        if (isUnauthenticated && publicKey && signMessage) {
            handleSaveTokens({ publicKey, signMessage }).catch(() =>
                setAuthenticationError(TRANSLATIONS.unexpectedError)
            );
        }
    }, [isUnauthenticated, publicKey, signMessage, handleSaveTokens]);

    useEffect(() => {
        if (verifyAccountError || claimNonceError) {
            setAuthenticationError(TRANSLATIONS.verifyAccountError);
        }
    }, [verifyAccountError, claimNonceError]);

    useEffect(() => {
        if (!connected && authenticationError) {
            setAuthenticationError(null);
        }
    }, [connected, authenticationError]);

    useEffect(() => {
        if (refreshError) {
            setAuthenticationError(TRANSLATIONS.unexpectedError);
        }
    }, [refreshError]);

    return {
        authenticationError,
    };
};
