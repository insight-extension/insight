export class HTTPError extends Error {
  public status: number;

  constructor({ message, status }: { message: string; status: number }) {
    super(message);

    this.status = status;
  }
}
