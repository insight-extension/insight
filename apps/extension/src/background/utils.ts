import { Storage } from "@plasmohq/storage";
import { fold, left, tryCatch } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";

import { SessionToken } from "@repo/shared/constants";
import type { TokenPayload } from "@repo/shared/types";
import { jwtDecode } from "@repo/shared/utils";

import { AccessTokenRequiredError } from "@/errors";

export const storage = new Storage({ area: "sync" });

const decodeAccessToken = (cookie: chrome.cookies.Cookie) => {
  const parsed = pipe(
    tryCatch(
      () => jwtDecode<TokenPayload>(cookie.value),
      (error: any) => {
        storage.set(SessionToken.ACCESS, null);

        left(new AccessTokenRequiredError(error.message));
      }
    )
  );
};

// need to use Public key and accessToken - only get accessToken
export const saveToken = async (cookie: chrome.cookies.Cookie) => {
  pipe(
    tryCatch(
      () => jwtDecode<TokenPayload>(cookie.value),
      (error) => left(error)
    ),
    fold(
      (error: any) => {
        storage.set(SessionToken.ACCESS, null);

        throw new AccessTokenRequiredError(error.message);
      },
      ({ publicKey }) => storage.set(SessionToken.ACCESS, publicKey)
    )
  );
};
