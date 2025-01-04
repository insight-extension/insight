export class AccessTokenRequiredError extends Error {
  constructor(message: string) {
    super(message);

    this.name = "AccessTokenRequiredError";
  }
}
