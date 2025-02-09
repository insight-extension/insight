import { StatusCode } from "../constants";

export class ExtendedError extends Error {
  constructor(
    public message: string,
    public statusCode?: StatusCode,
    public detail?: string,
    public traceId?: string
  ) {
    super(message);

    this.name = "ExtendedError";
  }
}

export class SessionExpiredError extends Error {
  constructor() {
    super();

    this.name = "SessionExpiredError";
  }
}

export class AuthenticationError extends Error {
  constructor() {
    super();

    this.name = "AuthenticationError";
  }
}

export class CreateSignatureError extends ExtendedError {
  constructor(
    public message: string,
    public statusCode = StatusCode.BAD_REQUEST,
    public detail = "",
    public traceId: string
  ) {
    super(message, statusCode, detail, traceId);

    this.name = "CreateSignatureError";
  }
}

export * from "./trace";
