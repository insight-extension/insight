import { sendToBackgroundViaRelay } from "@plasmohq/messaging";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";

import { RelayMessageError } from "./errors";
import { DepositMessage, RelayResponse, RelayRoute } from "./types";

class RelayMessenger {
  public async deposit({
    token,
    amount,
    subscriptionType,
    transactionSignature
  }: DepositMessage) {
    try {
      const response = await sendToBackgroundViaRelay<
        DepositMessage,
        RelayResponse
      >({
        name: RelayRoute.DEPOSIT as never,
        body: {
          token,
          subscriptionType,
          amount,
          transactionSignature
        }
      });
    } catch (error: any) {
      // todo: catchException
      throw new RelayMessageError(error.message);
    }
  }
}

export const relayMessenger = Object.freeze(new RelayMessenger());
