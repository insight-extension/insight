import type { PlasmoMessaging } from "@plasmohq/messaging";

import { StorageKey } from "@repo/shared/constants";

import { storage } from "@/background";
import { Status } from "@/types/index";

const handler: PlasmoMessaging.MessageHandler = async ({ body }, response) => {
  storage.set(StorageKey.DEPOSIT, {
    subscriptionType: body.subscriptionType,
    amount: body.amount,
    transactionSignature: body.transactionSignature
  });

  console.log("Deposit message received", body);

  response.send({
    status: Status.SUCCESS
  });
};

export default handler;
