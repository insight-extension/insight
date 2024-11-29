import type { PlasmoCSConfig } from "plasmo";

import { relayMessage } from "@plasmohq/messaging";

export const config: PlasmoCSConfig = {
  matches: ["http://localhost:5173/*", "http://localhost:1947/*"],
};

relayMessage({
  name: "ping",
});
