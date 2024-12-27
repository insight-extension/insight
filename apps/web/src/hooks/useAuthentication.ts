import { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { pipe } from "fp-ts/function";
import { chain, left, right, mapLeft } from "fp-ts/TaskEither";

import { SessionToken } from "@repo/shared/constants";
import { SessionExpiredError } from "@/errors/error";
import { isTokenExpired } from "@/lib";
import { authService } from "@/services";
import { sessionManager } from "@/services/session";

// todo: add autoconnect
// todo: connect on click
export const useAuthentication = () => {
    const intl = useIntl();
    const accessToken = sessionManager.getToken({
        key: SessionToken.ACCESS,
    });

    const { publicKey, connected, signMessage } = useWallet();

    const [authenticationError, setAuthenticationError] = useState<
        string | null
    >(null);

    const authenticate = useCallback(
        async ({
            publicKey,
            signMessage,
        }: {
            publicKey: PublicKey;
            signMessage: (message: Uint8Array) => Promise<Uint8Array>;
        }) => {
            // todo: twice execution
            console.log("CALLED", new Date().getTime());
            pipe(
                authService.claimNonce({ publicKey }),
                chain((nonceResponse) =>
                    authService.createSignature({
                        nonce: nonceResponse.nonce,
                        signMessageFn: signMessage,
                    })
                ),
                chain((signatureResponse) =>
                    authService.verifyAccount({
                        publicKey,
                        signature: signatureResponse.signature,
                    })
                ),
                chain((tokensResponse) =>
                    right(
                        sessionManager.saveTokens({
                            accessToken: tokensResponse.accessToken,
                            refreshToken: tokensResponse.refreshToken,
                        })
                    )
                ),
                mapLeft((error) => {
                    setAuthenticationError(
                        intl.formatMessage({ id: "error.authentication" })
                    );

                    return left(error);
                })
            )();
        },
        []
    );

    const tokenRefresh = useCallback(() => {
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
            tokenRefresh();
        }
    }, [connected, accessToken, tokenRefresh]);

    useEffect(() => {
        if (connected && !accessToken && publicKey && signMessage) {
            authenticate({ publicKey, signMessage });
        }
    }, [connected, accessToken, publicKey, signMessage, authenticate]);

    useEffect(() => {
        if (!connected && authenticationError) {
            setAuthenticationError(null);
        }
    }, [connected, authenticationError]);

    return {
        authenticationError,
    };
};
