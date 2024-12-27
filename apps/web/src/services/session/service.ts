import Cookies from "js-cookie";
import { fold, left, right } from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";

import { SessionToken } from "@repo/shared/constants";
import { authService } from "@/services";

class SessionManager {
    public setToken = ({
        key,
        value,
    }: {
        key: SessionToken;
        value: string;
    }) => {
        Cookies.set(key, value);
    };

    public getToken = ({ key }: { key: SessionToken }) =>
        Cookies.get(key) || "";

    public removeToken = ({ key }: { key: SessionToken }) =>
        Cookies.remove(key);

    public saveTokens = ({
        accessToken,
        refreshToken,
    }: {
        accessToken: string;
        refreshToken: string;
    }) => {
        this.setToken({
            key: SessionToken.ACCESS,
            value: accessToken,
        });
        this.setToken({
            key: SessionToken.REFRESH,
            value: refreshToken,
        });
    };

    public refreshToken = ({
        refreshToken,
    }: {
        refreshToken: string;
    }): void => {
        pipe(
            authService.refreshToken({ refreshToken }),
            fold(
                (error) => left(error),
                ({ accessToken, refreshToken }) => {
                    this.saveTokens({ accessToken, refreshToken });

                    return right(void 0);
                }
            )
        )();
    };
}

export const sessionManager = Object.freeze(new SessionManager());
