import { sendToBackgroundViaRelay } from "@plasmohq/messaging";

import {
    DepositMessage,
    RelayResponse,
    RelayRoute,
    RelayStatus,
} from "@/services/relay";

class RelayMessenger {
    public deposit = async ({
        token,
        amount,
        subscriptionType,
        transactionSignature,
    }: DepositMessage) => {
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
    };
}

export const relayMessenger = Object.freeze(new RelayMessenger());
