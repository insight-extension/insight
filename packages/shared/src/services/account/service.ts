import { TaskEither } from "fp-ts/lib/TaskEither";

import { APIError, apiClient } from "@repo/shared/api";
import { TraceId } from "@repo/shared/errors";

import "./types";
import { FreeTrialInfo } from "./types";

class AccountService {
  private baseURL = "account";

  private getURL(url: string) {
    return this.baseURL + url;
  }

  public getFreeTrialInfo(): TaskEither<APIError, FreeTrialInfo> {
    return apiClient.get<FreeTrialInfo>({
      url: this.getURL("/free-hours-info"),
      traceId: TraceId.FREE_TRIAL_INFO
    });
  }
}

export const accountService = Object.freeze(new AccountService());
