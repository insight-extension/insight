import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useCallback, useEffect, useState } from "react";
import { match, P } from "ts-pattern";
import { pipe } from "fp-ts/function";
import { tryCatch, chain, left, right } from "fp-ts/TaskEither";

import { SessionExpiredError } from "@/errors";
import { isTokenExpired } from "@/lib";
import { authService } from "@/services";
import { sessionManager, TokenKey } from "@/session";
import { ResponseStatus } from "@/http";

export const useAuthentication = () => {
    const accessToken = sessionManager.getToken({
        key: TokenKey.ACCESS,
    });

    const { publicKey, connected, signMessage } = useWallet();

    const [authenticationError, setAuthenticationError] = useState<
        string | null
    >(null);

    const handleAuthenticationFlow = useCallback(
        async ({
            publicKey,
            signMessage,
        }: {
            publicKey: PublicKey;
            signMessage: (message: Uint8Array) => Promise<Uint8Array>;
        }) => {
            const saveTokens = (accessToken: string, refreshToken: string) => {
                sessionManager.setToken({
                    key: TokenKey.ACCESS,
                    value: accessToken,
                });
                sessionManager.setToken({
                    key: TokenKey.REFRESH,
                    value: refreshToken,
                });
            };

            const handleError = (error: any) => {
                setAuthenticationError(error.message);

                return ResponseStatus.ERROR;
            };

            const handleRejectedError = (error: any) => {
                setAuthenticationError(error.message);

                return left(ResponseStatus.ERROR);
            };

            await pipe(
                tryCatch(
                    () => authService.claimNonce({ publicKey }),
                    (error: any) => handleError(error)
                ),
                chain(({ data: nonceResponse }) =>
                    match(nonceResponse)
                        .with(P.nullish, handleRejectedError)
                        .otherwise(({ nonce }) =>
                            tryCatch(
                                () =>
                                    authService.createSignature({
                                        nonce,
                                        signMessageFn: signMessage,
                                    }),
                                (error: any) => handleError(error)
                            )
                        )
                ),
                chain((signatureResponse) =>
                    match(signatureResponse)
                        .with(P.nullish, handleRejectedError)
                        .otherwise(({ signature }) =>
                            tryCatch(
                                () =>
                                    authService.verifyAccount({
                                        publicKey,
                                        signature,
                                    }),
                                (error: any) => handleError(error)
                            )
                        )
                ),
                chain(({ data: authTokensResponse }) =>
                    match(authTokensResponse)
                        .with(P.nullish, handleRejectedError)
                        .otherwise(({ accessToken, refreshToken }) =>
                            right(saveTokens(accessToken, refreshToken))
                        )
                )
            )();
        },
        []
    );

    useEffect(() => {
        const shouldRefreshToken = isTokenExpired(accessToken);

        if (shouldRefreshToken) {
            const refreshToken = sessionManager.getToken({
                key: TokenKey.REFRESH,
            });

            if (!refreshToken || isTokenExpired(refreshToken)) {
                throw new SessionExpiredError();
            }

            sessionManager.refreshToken({ refreshToken });
        }
    }, []);

    useEffect(() => {
        const accessToken = sessionManager.getToken({
            key: TokenKey.ACCESS,
        });

        if (accessToken && publicKey && signMessage) {
            handleAuthenticationFlow({ publicKey, signMessage });
        }
    }, [publicKey, signMessage, handleAuthenticationFlow]);

    useEffect(() => {
        if (!connected && authenticationError) {
            setAuthenticationError(null);
        }
    }, [connected, authenticationError]);

    return {
        authenticationError,
    };
};
