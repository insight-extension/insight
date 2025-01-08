export class TokenAccountNotFoundError extends Error {
  constructor(public message: string) {
    super(message);

    this.name = "TokenAccountNotFoundError";
  }
}

export class DepositToVaultError extends Error {
  constructor(public message: string) {
    super(message);

    this.name = "DepositToVaultError";
  }
}
