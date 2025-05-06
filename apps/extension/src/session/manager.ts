import { chain, fold, mapLeft, right, tryCatch } from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";
import { P, match } from "ts-pattern";

import { StorageKey } from "@repo/shared/constants";
import { authService } from "@repo/shared/services";
import {
  SessionTokenPayload,
  SessionTokenPayloadCodec
} from "@repo/shared/types";
import { jwtDecode } from "@repo/shared/utils";

import { storage } from "@/background";

import { InvalidAccessTokenError } from "./errors";

export class SessionManager {
  public decodeToken(token: string) {
    try {
      const payload = jwtDecode<SessionTokenPayload>(token);

      const validationResult = SessionTokenPayloadCodec.decode(payload);

      return match(validationResult)
        .with({ right: P.select() }, ({ publicKey }) => publicKey)
        .with({ left: P.select() }, (errors) => {
          throw new InvalidAccessTokenError(
            errors.map((error) => error.message).join(", ")
          );
        })
        .exhaustive();
    } catch (error: any) {
      throw new InvalidAccessTokenError(error.message);
    }
  }

  public refreshToken(refreshToken: string) {
    pipe(
      authService.refreshToken({ refreshToken }),
      chain((response) =>
        tryCatch(
          async () => {
            await storage.set(StorageKey.ACCESS_TOKEN, response.accessToken);
          },
          (error: any) => error
        )
      ),
      mapLeft((error) => {
        throw error;
      })
    )();
  }
}

export const sessionManager = Object.freeze(new SessionManager());
