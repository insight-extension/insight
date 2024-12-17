import Cookies from "js-cookie";

import { authService } from "@/services";
import { pipe } from "fp-ts/lib/function";
import { tryCatch } from "fp-ts/lib/TaskEither";

export enum TokenKey {
    ACCESS = "accessToken",
    REFRESH = "refreshToken",
}

class SessionManager {
    public setToken({ key, value }: { key: TokenKey; value: string }) {
        Cookies.set(key, value);
    }

    public getToken({ key }: { key: TokenKey }) {
        return Cookies.get(key) || "";
    }

    public removeToken({ key }: { key: TokenKey }) {
        Cookies.remove(key);
    }

    public async refreshToken({ refreshToken }: { refreshToken: string }) {
        // TODO
        await pipe(
            tryCatch(
                () => authService.refreshToken({ refreshToken }),
                (error: any) => throw new Error("Error refreshing token")
                
            )
            // chain(({ data: nonceResponse }) =>
            //     match(nonceResponse)
            //         .with(P.nullish, handleRejectedError)
            //         .otherwise(({ nonce }) =>
            //             tryCatch(
            //                 () =>
            //                     authService.createSignature({
            //                         nonce,
            //                         signMessageFn: signMessage,
            //                     }),
            //                 (error: any) => handleError(error)
            //             )
            //         )
            // ),
            // chain((signatureResponse) =>
            //     match(signatureResponse)
            //         .with(P.nullish, handleRejectedError)
            //         .otherwise(({ signature }) =>
            //             tryCatch(
            //                 () =>
            //                     authService.verifyAccount({
            //                         publicKey,
            //                         signature,
            //                     }),
            //                 (error: any) => handleError(error)
            //             )
            //         )
            // ),
            // chain(({ data: authTokensResponse }) =>
            //     match(authTokensResponse)
            //         .with(P.nullish, handleRejectedError)
            //         .otherwise(({ accessToken, refreshToken }) =>
            //             right(saveTokens(accessToken, refreshToken))
            //         )
            // )
        )();
        try {
            const { data: refreshTokenResponse } =
                await authService.refreshToken({
                    refreshToken,
                });

            if (refreshTokenResponse) {
                this.setToken({
                    key: TokenKey.ACCESS,
                    value: refreshTokenResponse.accessToken,
                });
                this.setToken({
                    key: TokenKey.REFRESH,
                    value: refreshTokenResponse.refreshToken,
                });
            }
        } catch (error) {
            console.error(error);
        }
    }
}

export const sessionManager = new SessionManager();
