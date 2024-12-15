import { sendToBackgroundViaRelay } from "@plasmohq/messaging";

import {
    BalanceMessage,
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

    public async balance({ amount, token }: BalanceMessage) {
        try {
            const { status } = await sendToBackgroundViaRelay<
                BalanceMessage,
                RelayResponse
            >({
                name: RelayRoute.BALANCE as never,
                body: {
                    amount,
                    token,
                },
            });

            return status;
        } catch (error) {
            return RelayStatus.ERROR;
        }
    }
}

export const relayMessenger = new RelayMessenger();
