import { fold, right } from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import Cookies from "js-cookie";

import { SessionToken } from "@repo/shared/constants";

import { authService } from "@/services";

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

  public refreshToken({ refreshToken }: { refreshToken: string }) {
    pipe(
      authService.refreshToken({ refreshToken }),
      fold(
        (error) => {
          throw error;
        },
        ({ accessToken, refreshToken }) =>
          right(this.saveTokens({ accessToken, refreshToken }))
      )
    )();
  }
}

export const sessionManager = Object.freeze(new SessionManager());
