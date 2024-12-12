import { JwtPayload, jwtDecode } from "jwt-decode";

export const tokenExpiresIn = (token: string) => {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        const expirationTime = decoded.exp || 0;

        // convert from seconds to milliseconds
        const expirationTimeInMilliSeconds = expirationTime * 1000;

        return expirationTimeInMilliSeconds;
    } catch (error) {
        return 0;
    }
};

export const isTokenAlive = (expirationTime: number) => {
    const currentTime = Date.now();

    return currentTime <= expirationTime;
};

export const isTokenExpired = (token: string) => {
    return !isTokenAlive(tokenExpiresIn(token));
};
