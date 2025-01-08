import { relayMessage } from "@plasmohq/messaging";
import type { PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
  // todo: use only with ENV urls
  matches: ["<all_urls>"]
};

relayMessage({
  name: "deposit"
});
