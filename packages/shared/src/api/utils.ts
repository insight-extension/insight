import { fold } from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { HTTPError } from "ky";

import { APIError, APIErrorCodec } from "@repo/shared/api";
import { PRIVATE_API_ROUTES } from "@repo/shared/constants";

import { API_URL } from "./config";

// todo: review error handling
export const parseAPIError = (error: HTTPError, traceId: string): APIError => {
  return pipe(
    APIErrorCodec.decode(error),
    fold(
      () => new APIError(error.message, error.response.status, "", traceId),
      (decodedError) =>
        new APIError(
          Array.isArray(decodedError.message)
            ? decodedError.message.join(", ")
            : decodedError.message,
          decodedError.statusCode,
          decodedError.error,
          traceId
        )
    )
  );
};

export const generateBearerToken = (accessToken: string) =>
  "Bearer " + accessToken;

export const isPrivateApiRoute = (url: string): boolean => {
  const allRoutes = Object.values(PRIVATE_API_ROUTES).flatMap((section) =>
    typeof section === "string" ? [section] : Object.values(section)
  );
  const urlPath = url.replace(API_URL, "");

  return allRoutes.some((route) => urlPath.startsWith(route));
};
