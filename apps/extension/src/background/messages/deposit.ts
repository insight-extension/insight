import type { PlasmoMessaging } from "@plasmohq/messaging";

import { StorageKey } from "@repo/shared/constants";
import { DepositMessage } from "@repo/shared/services";

import { storage } from "@/background";
import { Status } from "@/types/index";

const handler: PlasmoMessaging.MessageHandler<DepositMessage, any> = async (
  { body },
  response
) => {
  if (!body) return;

  storage.set(StorageKey.DEPOSIT, {
    subscriptionType: body.subscriptionType,
    amount: body.amount,
    transactionSignature: body.transactionSignature
  });

  response.send({
    status: Status.SUCCESS
  });
};

export default handler;
