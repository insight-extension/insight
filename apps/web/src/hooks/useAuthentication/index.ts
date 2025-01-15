import { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import * as Sentry from "@sentry/react";
import { PublicKey } from "@solana/web3.js";
import { chain, mapLeft, right } from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { useAtom } from "jotai";
import { match } from "ts-pattern";

import { SessionToken } from "@repo/shared/constants";
import { SessionExpiredError, TraceId } from "@repo/shared/errors";
import { authService } from "@repo/shared/services";

import { isTokenExpired } from "@/lib";
import { sessionManager } from "@/services";
import { authenticationErrorMessageAtom } from "@/store";

import { UseAuthentication } from "./types";

export const useAuthentication = (): UseAuthentication => {
  const intl = useIntl();

  const [errorMessage, setErrorMessage] = useAtom(
    authenticationErrorMessageAtom
  );

  const handleErrorMessage = useCallback((errorMessage: string | null) => {
    setErrorMessage(errorMessage);
  }, []);

  const authenticate = useCallback(
    async ({
      publicKey,
      signMessage
    }: {
      publicKey: PublicKey;
      signMessage: (message: Uint8Array) => Promise<Uint8Array>;
    }) => {
      handleErrorMessage(null);

      pipe(
        authService.claimNonce({ publicKey }),
        chain((nonceResponse) =>
          authService.createSignature({
            nonce: nonceResponse.nonce,
            signMessageFn: signMessage
          })
        ),
        chain((signatureResponse) =>
          authService.verifyAccount({
            publicKey,
            signature: signatureResponse.signature
          })
        ),
        chain((tokensResponse) =>
          right(
            sessionManager.saveTokens({
              accessToken: tokensResponse.accessToken,
              refreshToken: tokensResponse.refreshToken
            })
          )
        ),
        mapLeft((error) => {
          Sentry.captureException(error);

          match(error)
            .with({ traceId: TraceId.CREATE_SIGNATURE }, () =>
              handleErrorMessage(
                intl.formatMessage({
                  id: "error.createSignature"
                })
              )
            )
            .otherwise(() =>
              handleErrorMessage(
                intl.formatMessage({
                  id: "error.authentication"
                })
              )
            );
        })
      )();
    },
    []
  );

  const tokenRefresh = useCallback(() => {
    const refreshToken = sessionManager.getToken({
      key: SessionToken.REFRESH
    });

    if (
      !refreshToken ||
      isTokenExpired({
        token: refreshToken
      })
    ) {
      throw new SessionExpiredError();
    }

    sessionManager.refreshToken(refreshToken);
  }, []);

  return useMemo(
    () => ({
      authenticate,
      tokenRefresh,
      errorMessage,
      onErrorMessage: handleErrorMessage
    }),
    [authenticate, tokenRefresh, errorMessage, handleErrorMessage]
  );
};
