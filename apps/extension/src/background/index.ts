import { Storage } from "@plasmohq/storage";
import { P, match } from "ts-pattern";

import { SessionToken } from "@repo/shared/constants";
import { extractDomainFromURL } from "@repo/shared/utils";

import { UI_URL } from "@/constants";

export const storage = new Storage({ area: "sync" });

chrome.cookies.get(
  { url: UI_URL, name: SessionToken.ACCESS },
  async (cookie) => {
    if (cookie && cookie.value) {
      storage.set(SessionToken.ACCESS, cookie.value);
    }
  }
);

chrome.cookies.onChanged.addListener(async function (changedInfo) {
  if (changedInfo.cookie.domain === extractDomainFromURL(UI_URL)) {
    console.log("COOKIE", changedInfo);
    match(changedInfo)
      .with({ removed: true, cause: P.not("overwrite") }, async () => {
        await storage.set(SessionToken.ACCESS, null);
      })
      .otherwise(() =>
        storage.set(SessionToken.ACCESS, changedInfo.cookie.value)
      );
  }
});
