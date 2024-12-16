import { authService } from "@/services";
import { Cookies } from "react-cookie";

export enum TokenKey {
    ACCESS = "accessToken",
    REFRESH = "refreshToken",
}

class SessionManager {
    private cookies: Cookies;

    constructor() {
        this.cookies = new Cookies();
    }

    public setToken({ key, value }: { key: TokenKey; value: string }) {
        this.cookies.set(key, value);
    }

    public getToken({ key }: { key: TokenKey }) {
        return this.cookies.get(key);
    }

    public removeToken({ key }: { key: TokenKey }) {
        this.cookies.remove(key);
    }

    public async refreshToken({ refreshToken }: { refreshToken: string }) {
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
