import {
  type APIError,
  type FetchParams,
  type MutationParams,
  type RequestParams,
  parseAPIError
} from "@shared/api";
import { TaskEither, tryCatch } from "fp-ts/lib/TaskEither";
import ky, {
  HTTPError,
  type KyInstance,
  type Options as KyRequestOptions
} from "ky";

import { API_URL } from "./config";

class APIClient {
  public api: KyInstance;

  constructor(requestType: string, responseType: string) {
    const options: KyRequestOptions = {
      prefixUrl: API_URL,
      headers: {
        Accept: responseType, // the response format the client expects from the server
        "Content-Type": requestType, // the request body format of the data being sent to the server
        "Accept-Language": "en-US" // todo: dynamic language
      }
    };

    this.api = ky.create({
      ...options,
      hooks: {
        // todo: complete it
        // beforeRequest: [authorizationInterceptor]
      }
    });
  }

  private request<R>({
    url,
    options,
    traceId
  }: RequestParams): TaskEither<APIError, R> {
    return tryCatch(
      async () => {
        const response = await this.api(url, {
          ...options
        });

        const contentType = response.headers.get("content-type");

        if (contentType?.startsWith("text/")) {
          return (await response.text()) as R;
        } else if (contentType?.startsWith("application/json")) {
          return await response.json<R>();
        } else {
          throw new Error("Invalid content type");
        }
      },
      (error: unknown) => parseAPIError(error as HTTPError, traceId)
    );
  }

  public get<R>({
    url,
    traceId,
    options
  }: FetchParams): TaskEither<APIError, R> {
    return this.request<R>({
      url,
      options: {
        method: "GET",
        ...options
      },
      traceId
    });
  }

  public post<B, R>({
    url,
    body,
    traceId,
    options
  }: MutationParams<B>): TaskEither<APIError, R> {
    return this.request<R>({
      url,
      options: {
        method: "POST",
        ...(body && { json: body }),
        ...options
      },
      traceId
    });
  }

  public patch<B, R>({
    url,
    body,
    traceId
  }: MutationParams<B>): TaskEither<APIError, R> {
    return this.request<R>({
      url,
      options: {
        method: "PATCH",
        json: body
      },
      traceId
    });
  }

  public put<B, R>({
    url,
    body,
    traceId
  }: MutationParams<B>): TaskEither<APIError, R> {
    return this.request<R>({
      url,
      options: {
        method: "PUT",
        json: body
      },
      traceId
    });
  }

  public delete<R>({
    url,
    traceId
  }: MutationParams<R>): TaskEither<APIError, R> {
    return this.request<R>({ url, options: { method: "DELETE" }, traceId });
  }
}

export const apiClient = Object.freeze(
  new APIClient("application/json", "application/json")
);
