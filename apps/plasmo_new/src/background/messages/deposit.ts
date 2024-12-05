import type { PlasmoMessaging } from "@plasmohq/messaging";

import { storage } from "~background";
import { StorageKey } from "~constants";
import { Status } from "~types/index";

const handler: PlasmoMessaging.MessageHandler = async (request, response) => {
  const body = request.body;

  storage.set(StorageKey.DEPOSIT_FUNDS, 1000 + body.amount);

  response.send({
    status: Status.SUCCESS,
    body,
  });
};

export default handler;
