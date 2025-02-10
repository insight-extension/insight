import { sendToBackgroundViaRelay } from "@plasmohq/messaging";
import * as Sentry from "@sentry/react";

import { RelayMessageError } from "./errors";
import { DepositMessage, RelayResponse, RelayRoute } from "./types";

class RelayMessenger {
  public async deposit({
    token,
    amount,
    transactionSignature
  }: DepositMessage) {
    try {
      await sendToBackgroundViaRelay<DepositMessage, RelayResponse>({
        name: RelayRoute.DEPOSIT as never,
        body: {
          token,
          amount,
          transactionSignature
        }
      });
    } catch (error: any) {
      Sentry.captureException(new RelayMessageError(error.message));
    }
  }
}

export const relayMessenger = Object.freeze(new RelayMessenger());
