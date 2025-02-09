import { TaskEither } from "fp-ts/lib/TaskEither";

import { APIError, apiClient } from "@repo/shared/api";
import { TraceId } from "@repo/shared/errors";

import { FaucetClaimSignature } from "./types";

class FaucetService {
  private baseURL = "faucet";

  private getURL(url: string) {
    return this.baseURL + url;
  }

  public claim(): TaskEither<APIError, FaucetClaimSignature> {
    return apiClient.post<{}, FaucetClaimSignature>({
      url: this.getURL("/claim"),
      body: {},
      traceId: TraceId.FAUCE_CLAIM
    });
  }
}

export const faucetService = Object.freeze(new FaucetService());
