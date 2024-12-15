import type { PlasmoMessaging } from "@plasmohq/messaging";

import { storage } from "~background";
import { StorageKey } from "~constants";
import { Status } from "~types/index";

// todo: complete
const handler: PlasmoMessaging.MessageHandler = async ({ body }, response) => {
  storage.set(StorageKey.DEPOSIT_FUNDS, body.amount);

  response.send({
    status: Status.SUCCESS,
  });
};

export default handler;
