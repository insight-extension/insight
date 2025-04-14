import bs58 from "bs58";
import { TaskEither, tryCatch } from "fp-ts/lib/TaskEither";

import { APIError, apiClient } from "@/api";
import { CreateSignatureError, TraceId } from "@/errors";

import {
  type AuthClaimNonce,
  type AuthCreateSignature,
  type AuthNonce,
  type AuthPublicKey,
  type AuthRefreshToken,
  type AuthSignature,
  type AuthTokens,
  type AuthVerifyAccount
} from "./types";

// todo: use validation
class AuthService {
  private baseURL = "auth";

  private getURL(url: string) {
    return this.baseURL + url;
  }

  public claimNonce({
    publicKey
  }: AuthPublicKey): TaskEither<APIError, AuthNonce> {
    return apiClient.post<AuthClaimNonce, AuthNonce>({
      url: this.getURL("/claim"),
      body: {
        publicKey: publicKey.toBase58()
      },
      traceId: TraceId.CLAIM_NONCE
    });
  }

  public verifyAccount({
    publicKey,
    signature
  }: AuthPublicKey & AuthSignature): TaskEither<APIError, AuthTokens> {
    return apiClient.post<AuthVerifyAccount, AuthTokens>({
      url: this.getURL("/verify"),
      body: {
        publicKey: publicKey.toBase58(),
        signature
      },
      traceId: TraceId.VERIFY_ACCOUNT
    });
  }

  public refreshToken({
    refreshToken
  }: AuthRefreshToken): TaskEither<APIError, AuthTokens> {
    return apiClient.post<AuthRefreshToken, AuthTokens>({
      url: this.getURL("/refresh-token"),
      body: {
        refreshToken
      },
      traceId: TraceId.REFRESH_TOKEN
    });
  }

  public createSignature({
    nonce,
    signMessageFn
  }: AuthCreateSignature): TaskEither<CreateSignatureError, AuthSignature> {
    return tryCatch(
      async () => {
        const textEncoder = new TextEncoder();

        const signedMessage = await signMessageFn(textEncoder.encode(nonce));

        const signature = bs58.encode(signedMessage);

        return { signature };
      },
      (error: any) =>
        new CreateSignatureError(
          error.message,
          undefined,
          undefined,
          // todo: use instance of error?
          TraceId.CREATE_SIGNATURE
        )
    );
  }
}

export const authService = Object.freeze(new AuthService());
