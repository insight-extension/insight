import { WalletError } from "@solana/wallet-adapter-base";

import { StatusCode } from "@repo/shared/constants";
import { ExtendedError } from "@repo/shared/errors";

//todo: add translations
export class TokenAccountNotFoundError extends WalletError {
  name = "TokenAccountNotFoundError";
  message = "Account for requested token not found, please create one.";
}

export class SessionExpiredError extends WalletError {
  name = "SessionExpiredError";
  message = "Your session has expired, please login again.";
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

export class WalletConnectionError extends WalletError {
  name = "WalletConnectionError";
  message = "Failed to connect to wallet.";
}

export class WalletDisconnectionError extends WalletError {
  name = "WalletDisconnectionError";
  message = "Failed to disconnect wallet.";
}
