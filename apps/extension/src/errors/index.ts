export class AccessTokenRequiredError extends Error {
  constructor(public message: string) {
    super(message);

    this.name = "AccessTokenRequiredError";
  }
}
