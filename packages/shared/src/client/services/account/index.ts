import bs58 from "bs58";

import { apiHTTPClient } from "@repo/shared/client/http";
import {
  CreateAccountRequest,
  CreateAccountResponse,
  CreateSignatureResponse,
  StatusResponse,
  ValidateAccountRequest,
} from "@repo/shared/types";
import {
  CreateAccountSchema,
  CreateSignatureSchema,
  StatusSchema,
} from "@repo/shared/validation";

class AccountService {
  private baseURL = "/account";

  private getURL(url: string) {
    return this.baseURL + url;
  }

  public createAccount = async ({
    publicKey,
  }: CreateAccountRequest): Promise<CreateAccountResponse> => {
    const response = await apiHTTPClient.post<
      CreateAccountRequest,
      CreateAccountResponse
    >(this.getURL("/"), {
      publicKey,
    });

    return CreateAccountSchema.parse(response);
  };

  public validateAccount = async ({
    publicKey,
    signature,
  }: ValidateAccountRequest): Promise<StatusResponse> => {
    const response = await apiHTTPClient.post<
      ValidateAccountRequest,
      StatusResponse
    >(this.getURL("/validate"), {
      publicKey,
      signature,
    });

    return StatusSchema.parse(response);
  };

  public createSignature = async ({
    nonce,
    signMessageFn,
  }: {
    nonce: string;
    signMessageFn: (message: Uint8Array) => Promise<Uint8Array>;
  }): Promise<CreateSignatureResponse | undefined> => {
    {
      const encodedNonce = new TextEncoder().encode(nonce);

      if (encodedNonce) {
        const signedMessage = await signMessageFn(encodedNonce);

        if (signedMessage) {
          const signature = bs58.encode(signedMessage);

          return CreateSignatureSchema.parse({ signature });
        }
      }
    }
  };
}

export const accountService = new AccountService();
