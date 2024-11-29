import type { PlasmoMessaging } from "@plasmohq/messaging";
import { storage } from "~background";
import { StorageKey } from "~constants";

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log("Received ping message", req, res);

  storage.set(StorageKey.DEPOSIT_FUNDS, 1000);

  res.send({
    message: "pong",
  });
};

export default handler;
