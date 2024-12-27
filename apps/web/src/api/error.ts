import * as t from "io-ts";

export const APIErrorCodec = t.type({
    message: t.string,
    statusCode: t.number,
    error: t.string,
});

export class APIError extends Error {
    constructor(
        public message: string,
        public statusCode: number,
        public error: string
    ) {
        super(message);

        this.name = "APIError";
    }
}
