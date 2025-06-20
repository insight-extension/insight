export class InvalidAccessTokenError extends Error {
  constructor(public message: string) {
    super(message);

    this.name = "InvalidAccessTokenError";
  }
}
