export class RelayMessageError extends Error {
  constructor(public message: string) {
    super(message);

    this.name = "RelayMessageError";
  }
}
