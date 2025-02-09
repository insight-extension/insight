import type { KyRequest } from "ky";
import { match } from "ts-pattern";

import { SessionToken } from "@repo/shared/constants";
import { sessionManager } from "@repo/shared/services";

import { generateBearerToken, isPrivateApiRoute } from "..";

type APIRequestConfig = KyRequest;

const setAuthorizationHeader = <Config extends APIRequestConfig>(
  requestConfig: Config,
  token: string
) => {
  requestConfig.headers.set("Authorization", generateBearerToken(token));
};

const requestQueue: any[] = [];

let isRefreshing = false;

// todo: review it
export const authorizationInterceptor = async <Config extends APIRequestConfig>(
  requestConfig: Config
): Promise<Config> => {
  const url = requestConfig.url as string;

  if (!isPrivateApiRoute(url)) {
    return requestConfig;
  }

  sessionManager.validateSession();

  const accessToken = sessionManager.getToken({ key: SessionToken.ACCESS });

  if (sessionManager.shouldRefreshToken(accessToken)) {
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const refreshToken = sessionManager.getToken({
          key: SessionToken.REFRESH
        });

        const refreshResult = await sessionManager.refreshToken(refreshToken);

        let refreshedAccessToken = "";

        match(refreshResult)
          .with({ _tag: "Left" }, ({ left }) => {
            throw left;
          })
          .with({ _tag: "Right" }, ({ right }) => {
            refreshedAccessToken = right.accessToken;

            setAuthorizationHeader(requestConfig, refreshedAccessToken);
          });

        setAuthorizationHeader(
          requestConfig,
          refreshResult._tag === "Right"
            ? refreshResult.right.accessToken
            : accessToken
        );
        isRefreshing = false;
        // Retry all the queued requests
        requestQueue.forEach((request) => request(refreshedAccessToken));
        // Clear the queue
        requestQueue.length = 0;

        return requestConfig;
      } catch (error) {
        isRefreshing = false;

        throw error;
      }
    }

    return new Promise((resolve) => {
      requestQueue.push((newAccessToken: string) => {
        setAuthorizationHeader(requestConfig, newAccessToken);

        resolve(requestConfig);
      });
    });
  }

  setAuthorizationHeader(requestConfig, accessToken);

  return requestConfig;
};
