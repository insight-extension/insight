import Cookies from "js-cookie";
import { chain, left, right, tryCatch } from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { match, P } from "ts-pattern";

import { authService } from "@/services";
import { HTTPError } from "@/http";
import { SessionToken } from "@/constants";

class SessionManager {
    public setToken({ key, value }: { key: SessionToken; value: string }) {
        Cookies.set(key, value);
    }

    public getToken({ key }: { key: SessionToken }) {
        return Cookies.get(key) || "";
    }

    public removeToken({ key }: { key: SessionToken }) {
        Cookies.remove(key);
    }

    public saveTokens({
        accessToken,
        refreshToken,
    }: {
        accessToken: string;
        refreshToken: string;
    }) {
        this.setToken({
            key: SessionToken.ACCESS,
            value: accessToken,
        });
        this.setToken({
            key: SessionToken.REFRESH,
            value: refreshToken,
        });
    }

    public async refreshToken({
        refreshToken,
    }: {
        refreshToken: string;
    }): Promise<void> {
        pipe(
            tryCatch(
                () => authService.refreshToken({ refreshToken }),
                (error: any) => {
                    throw new HTTPError({
                        message: error.message,
                        status: error.status,
                    });
                }
            ),
            chain(({ data: tokens }) =>
                match(tokens)
                    .with(P.nonNullable, ({ accessToken, refreshToken }) =>
                        right(() =>
                            this.saveTokens({ accessToken, refreshToken })
                        )
                    )
                    .otherwise(() =>
                        left(
                            new HTTPError({
                                message: "Failed to refresh token",
                                status: 500,
                            })
                        )
                    )
            )
        )();
    }
}

export const sessionManager = new SessionManager();
