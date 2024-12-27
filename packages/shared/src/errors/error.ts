import { StatusCode } from "@/constants";

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
