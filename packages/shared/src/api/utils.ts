import { fold } from "fp-ts/Either";
import { pipe } from "fp-ts/function";

import { APIError, APIErrorCodec } from "@repo/shared/api";
import { StatusCode } from "@repo/shared/constants";

export const parseAPIError = (error: unknown, traceId: string): APIError =>
  pipe(
    APIErrorCodec.decode(error),
    fold(
      () => new APIError("", StatusCode.INTERNAL_SERVER_ERROR, "", traceId),
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
