import { sendToBackgroundViaRelay } from "@plasmohq/messaging";

import {
    BalanceMessage,
    DepositMessage,
    RelayResponse,
    RelayStatus,
} from "@/relay";

enum RelayRoute {
    DEPOSIT = "deposit",
    BALANCE = "balance",
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
