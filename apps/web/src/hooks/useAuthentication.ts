import { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { match, P } from "ts-pattern";
import { pipe } from "fp-ts/function";
import { tryCatch, chain, left, right } from "fp-ts/TaskEither";

import { SessionExpiredError } from "@/errors";
import { isTokenExpired } from "@/lib";
import { authService } from "@/services";
import { sessionManager } from "@/session";
import { ResponseStatus } from "@/http";
import { SessionToken } from "@/constants";

// todo: add autoconnect
export const useAuthentication = () => {
    const intl = useIntl();
    const accessToken = sessionManager.getToken({
        key: SessionToken.ACCESS,
    });

    const { publicKey, connected, signMessage } = useWallet();

    const [authenticationError, setAuthenticationError] = useState<
        string | null
    >(null);

    const handleAuthentication = useCallback(
        async ({
            publicKey,
            signMessage,
        }: {
            publicKey: PublicKey;
            signMessage: (message: Uint8Array) => Promise<Uint8Array>;
        }) => {
            const handleErrorMessage = (errorMessage: string) => {
                setAuthenticationError(errorMessage);

                return ResponseStatus.ERROR;
            };

            const handleRejectedError = (error: any) => {
                setAuthenticationError(error.message);

                return left(ResponseStatus.ERROR);
            };

            // todo: should catch nullish? review response object for error/parse error
            await pipe(
                tryCatch(
                    () => authService.claimNonce({ publicKey }),
                    (error: any) => handleErrorMessage(error.message)
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
                                () =>
                                    handleErrorMessage(
                                        intl.formatMessage({
                                            id: "error.createSignature",
                                        })
                                    )
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
                                (error: any) =>
                                    handleErrorMessage(error.message)
                            )
                        )
                ),
                chain(({ data: authTokensResponse }) =>
                    match(authTokensResponse)
                        .with(P.nullish, handleRejectedError)
                        .otherwise(({ accessToken, refreshToken }) =>
                            right(
                                sessionManager.saveTokens({
                                    accessToken,
                                    refreshToken,
                                })
                            )
                        )
                )
            )();
        },
        []
    );

    const handleRefreshToken = useCallback(() => {
        const refreshToken = sessionManager.getToken({
            key: SessionToken.REFRESH,
        });

        if (
            !refreshToken ||
            isTokenExpired({
                token: refreshToken,
            })
        ) {
            throw new SessionExpiredError();
        }

        sessionManager.refreshToken({ refreshToken });
    }, []);

    useEffect(() => {
        if (
            connected &&
            accessToken &&
            isTokenExpired({
                token: accessToken,
            })
        ) {
            handleRefreshToken();
        }
    }, [connected, accessToken, handleRefreshToken]);

    useEffect(() => {
        if (connected && !accessToken && publicKey && signMessage) {
            handleAuthentication({ publicKey, signMessage });
        }
    }, [connected, accessToken, publicKey, signMessage, handleAuthentication]);

    useEffect(() => {
        if (!connected && authenticationError) {
            setAuthenticationError(null);
        }
    }, [connected, authenticationError]);

    return {
        authenticationError,
    };
};
