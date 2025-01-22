import { TaskEither, tryCatch } from "fp-ts/lib/TaskEither";
import ky from "ky";

import {
  type APIError,
  type FetchParams,
  type MutationParams,
  type RequestParams,
  parseAPIError
} from "@repo/shared/api";

import { API_URL } from "./config";

class APIClient {
  private baseURL: string;
  private headers: HeadersInit;

  constructor() {
    this.baseURL = API_URL;
    this.headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Accept-Language": "en-US" // todo: dynamic language
    };
  }

  private getURL(url: string) {
    return this.baseURL + url;
  }

  private request = <R>({
    url,
    options,
    traceId
  }: RequestParams): TaskEither<APIError, R> =>
    tryCatch(
      async () =>
        await ky(this.getURL(url), {
          headers: this.headers,
          ...options
        }).json<R>(),
      (error: unknown) => parseAPIError(error, traceId)
    );

  public get = <R>({ url, traceId }: FetchParams): TaskEither<APIError, R> =>
    this.request<R>({
      url,
      options: {
        method: "GET"
      },
      traceId
    });

  public post = <B, R>({
    url,
    body,
    traceId
  }: MutationParams<B>): TaskEither<APIError, R> =>
    this.request<R>({
      url,
      options: {
        method: "POST",
        json: body
      },
      traceId
    });

  public patch = <B, R>({
    url,
    body,
    traceId
  }: MutationParams<B>): TaskEither<APIError, R> =>
    this.request<R>({
      url,
      options: {
        method: "PATCH",
        json: body
      },
      traceId
    });

  public put = <B, R>({
    url,
    body,
    traceId
  }: MutationParams<B>): TaskEither<APIError, R> =>
    this.request<R>({
      url,
      options: {
        method: "PUT",
        json: body
      },
      traceId
    });

  public delete = <R>({
    url,
    traceId
  }: MutationParams<R>): TaskEither<APIError, R> =>
    this.request<R>({ url, options: { method: "DELETE" }, traceId });
}

export const apiClient = Object.freeze(new APIClient());
