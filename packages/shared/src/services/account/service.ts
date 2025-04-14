import { TaskEither } from "fp-ts/lib/TaskEither";

import { APIError, apiClient, generateBearerToken } from "@/api";
import { TraceId } from "@/errors";

import { FreeTrialInfo } from "./types";

class AccountService {
  private baseURL = "account";

  private getURL(url: string) {
    return this.baseURL + url;
  }

  public getFreeTrialInfo(
    // todo: move to interceptor
    accessToken: string
  ): TaskEither<APIError, FreeTrialInfo> {
    return apiClient.get<FreeTrialInfo>({
      url: this.getURL("/free-hours-info"),
      traceId: TraceId.FREE_TRIAL_INFO,
      options: {
        headers: {
          Authorization: generateBearerToken(accessToken)
        }
      }
    });
  }
}

export const accountService = Object.freeze(new AccountService());
