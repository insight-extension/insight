import { relayMessage } from "@plasmohq/messaging";
import type { PlasmoCSConfig } from "plasmo";

import { RelayRoute } from "@repo/shared/services";

export const config: PlasmoCSConfig = {
  // todo: use only with ENV urls
  matches: ["<all_urls>"]
};

relayMessage({
  name: RelayRoute.DEPOSIT
});
