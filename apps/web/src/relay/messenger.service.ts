import { sendToBackgroundViaRelay } from "@plasmohq/messaging";

import {
    DepositMessage,
    RelayResponse,
    RelayRoute,
    RelayStatus,
} from "@/relay";

class RelayMessenger {
    public async deposit({
        token,
        amount,
        subscriptionType,
        transactionSignature,
    }: DepositMessage) {
        // todo: review
        try {
            const { status } = await sendToBackgroundViaRelay<
                DepositMessage,
                RelayResponse
            >({
                name: RelayRoute.DEPOSIT as never,
                body: {
                    token,
                    subscriptionType,
                    amount,
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
