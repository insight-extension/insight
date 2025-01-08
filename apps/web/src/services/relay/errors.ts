export class RelayMessageError extends Error {
  constructor(message: string) {
    super(message);

    this.name = "RelayMessageError";
  }
}
