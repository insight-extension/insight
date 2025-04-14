import { fold, right } from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import Cookies from "js-cookie";

import { SessionToken } from "@/constants";
import { AuthenticationError, SessionExpiredError } from "@/errors";
import { authService } from "@/services";
import { isTokenExpired } from "@/utils";

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
    refreshToken
  }: {
    accessToken: string;
    refreshToken: string;
  }) {
    this.setToken({
      key: SessionToken.ACCESS,
      value: accessToken
    });
    this.setToken({
      key: SessionToken.REFRESH,
      value: refreshToken
    });
  }

  public shouldRefreshToken(accessToken: string) {
    return (
      !accessToken ||
      isTokenExpired({
        token: accessToken
      })
    );
  }

  public refreshToken(refreshToken: string, shouldStore = true) {
    return pipe(
      authService.refreshToken({ refreshToken }),
      fold(
        (error) => {
          throw error;
        },
        ({ accessToken }) => {
          if (shouldStore) {
            this.setToken({
              key: SessionToken.ACCESS,
              value: accessToken
            });
          }

          return right({ accessToken });
        }
      )
    )();
  }

  public validateSession() {
    const refreshToken = this.getToken({
      key: SessionToken.REFRESH
    });

    if (!refreshToken) {
      throw new AuthenticationError();
    }

    if (isTokenExpired({ token: refreshToken })) {
      throw new SessionExpiredError();
    }
  }
}

export const sessionManager = Object.freeze(new SessionManager());
