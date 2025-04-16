import { APIError, apiClient, generateBearerToken } from "@shared/api";
import { TraceId } from "@shared/errors";
import { TaskEither } from "fp-ts/lib/TaskEither";

import { FaucetClaimSignature } from "./types";

class FaucetService {
  private baseURL = "faucet";

  private getURL(url: string) {
    return this.baseURL + url;
  }

  public claim(
    accessToken: string
  ): TaskEither<APIError, FaucetClaimSignature> {
    return apiClient.post<null, FaucetClaimSignature>({
      url: this.getURL("/claim"),
      body: null,
      traceId: TraceId.FAUCE_CLAIM,
      options: {
        // todo: move to interceptor
        headers: {
          Authorization: generateBearerToken(accessToken)
        }
      }
    });
  }
}

export const faucetService = Object.freeze(new FaucetService());
