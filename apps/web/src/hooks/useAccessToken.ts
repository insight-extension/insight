import { SessionToken } from "@/constants";
import { isTokenExpired } from "@/lib";
import { sessionManager } from "@/session";

export const useAccessToken = () => {
    const accessToken = sessionManager.getToken({
        key: SessionToken.ACCESS,
    });

    return {
        isExpired: isTokenExpired({
            token: accessToken,
        }),
        token: accessToken,
    };
};

export const useRefreshToken = () => {
    const refreshToken = sessionManager.getToken({
        key: SessionToken.REFRESH,
    });

    return {
        isExpired: isTokenExpired({
            token: refreshToken,
        }),
        token: refreshToken,
    };
};
