export class DepositToVaultError extends Error {
  constructor(public message: string) {
    super(message);

    this.name = "DepositToVaultError";
  }
}

export class AssociatedTokenAddressError extends Error {
  constructor(public message: string) {
    super(message);

    this.name = "AssociatedTokenAddress";
  }
}

export class TokenCannotProccedError extends Error {
  constructor(public message: string) {
    super(message);

    this.name = "AssociatedTokenAddress";
  }
}

export class CreateTokenAccountError extends Error {
  constructor(public message: string) {
    super(message);

    this.name = "CreateTokenAccountError";
  }
}

export class AirDropSOLError extends Error {
  constructor(public message: string) {
    super(message);

    this.name = "AirDropSOLError";
  }
}
