import { fold } from "fp-ts/Either";
import { pipe } from "fp-ts/function";

import { APIError, APIErrorCodec, StatusCode } from ".";

export const parseAPIError = (error: unknown): APIError =>
    pipe(
        APIErrorCodec.decode(error),
        fold(
            () => new APIError("", StatusCode.INTERNAL_SERVER_ERROR, ""),
            (decodedError) =>
                new APIError(
                    Array.isArray(decodedError.message)
                        ? decodedError.message.join(", ")
                        : decodedError.message,
                    decodedError.statusCode,
                    decodedError.error
                )
        )
    );
