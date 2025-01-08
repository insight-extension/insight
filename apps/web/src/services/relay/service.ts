import { sendToBackgroundViaRelay } from "@plasmohq/messaging";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";

import { DepositMessage, RelayResponse, RelayRoute } from "@/services/relay";

import { RelayMessageError } from "./errors";

class RelayMessenger {
  public deposit({
    token,
    amount,
    subscriptionType,
    transactionSignature
  }: DepositMessage) {
    pipe(
      tryCatch(
        async () =>
          await sendToBackgroundViaRelay<DepositMessage, RelayResponse>({
            name: RelayRoute.DEPOSIT as never,
            body: {
              token,
              subscriptionType,
              amount,
              transactionSignature
            }
          }),
        (error: any) => {
          // todo: catchException
          throw new RelayMessageError(error.message);
        }
      )
    )();
  }
}

export const relayMessenger = Object.freeze(new RelayMessenger());
