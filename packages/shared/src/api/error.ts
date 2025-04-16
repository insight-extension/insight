import { ExtendedError } from "@shared/errors";
import * as t from "io-ts";

export const BaseAPIErrorCodec = t.type({
  message: t.union([t.string, t.array(t.string)])
});

export const APIErrorCodec = t.type({
  message: t.union([t.string, t.array(t.string)]),
  statusCode: t.number,
  error: t.string
});

export class APIError extends ExtendedError {
  constructor(
    public message: string,
    public statusCode: number,
    public detail: string,
    public traceId: string
  ) {
    super(message, statusCode, detail, traceId);

    this.name = "APIError";
  }
}
