import { z } from "zod";

import { FetchResponse, FetchResult, HTTPError, ResponseStatus } from ".";

export const parseResponse = <D>(
    response: FetchResponse<D>,
    schema: z.ZodSchema<D>
): FetchResult<D> => {
    const parseResult = schema.safeParse(response);

    if (!parseResult.success) {
        return {
            data: null,
            error: null,
            status: ResponseStatus.PARSE_ERROR,
        };
    }

    return {
        data: parseResult.data,
        error: null,
        status: ResponseStatus.SUCCESS,
    };
};

export const catchErrorResponse = (error: HTTPError): FetchResult<null> => ({
    data: null,
    error,
    status: ResponseStatus.ERROR,
});

export const throwErrorResponse = (error: HTTPError): never => {
    throw error;
};
