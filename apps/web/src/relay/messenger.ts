import { sendToBackgroundViaRelay } from "@plasmohq/messaging";

import { DepositMessage, RelayResponse, RelayStatus } from "@/relay";

enum RelayRoute {
    DEPOSIT = "deposit",
}

class RelayMessenger {
    public async deposit({
        amount,
        subscriptionType,
        transactionSignature,
    }: DepositMessage) {
        try {
            const { status } = await sendToBackgroundViaRelay<
                DepositMessage,
                RelayResponse
            >({
                name: RelayRoute.DEPOSIT as never,
                body: {
                    subscriptionType,
                    amount: Number(amount),
                    transactionSignature,
                },
            });

            return status;
        } catch (error) {
            return RelayStatus.ERROR;
        }
    }
}

export const relayMessenger = new RelayMessenger();
