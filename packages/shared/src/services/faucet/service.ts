import { TaskEither } from "fp-ts/lib/TaskEither";

import { APIError, apiClient, generateBearerToken } from "@repo/shared/api";
import { SessionToken } from "@repo/shared/constants";
import { TraceId } from "@repo/shared/errors";

import { sessionManager } from "../session";
import { FaucetClaimSignature } from "./types";

class FaucetService {
  private baseURL = "faucet";

  private getURL(url: string) {
    return this.baseURL + url;
  }

  public claim(): TaskEither<APIError, FaucetClaimSignature> {
    // todo: move to interceptor
    const accessToken = sessionManager.getToken({
      key: SessionToken.ACCESS
    });

    return apiClient.post<{}, FaucetClaimSignature>({
      url: this.getURL("/claim"),
      body: {},
      traceId: TraceId.FAUCE_CLAIM,
      options: {
        headers: {
          Authorization: generateBearerToken(accessToken)
        }
      }
    });
  }
}

export const faucetService = Object.freeze(new FaucetService());
