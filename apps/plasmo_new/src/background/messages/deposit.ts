import type { PlasmoMessaging } from "@plasmohq/messaging";

import { storage } from "~background";
import { StorageKey } from "~constants";

const handler: PlasmoMessaging.MessageHandler = async (request, response) => {
  console.log("Received message", request, response);

  storage.set(StorageKey.DEPOSIT_FUNDS, 1000);

  response.send({
    message: "deposit",
  });
};

export default handler;
