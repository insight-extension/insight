import { Storage } from "@plasmohq/storage";
import { match, P } from "ts-pattern";

import { SessionToken } from "@repo/ui/constants";
import { extractDomainFromURL, jwtDecode } from "@repo/shared/utils";
import type { TokenPayload } from "@repo/shared/types";

import { StorageKey } from "~constants";
import { UI_URL } from "~configs";

export const storage = new Storage({ area: "sync" });

chrome.cookies.get(
  { url: UI_URL, name: SessionToken.ACCESS },
  async (cookie) => {
    if (cookie) {
      // review
      try {
        const { publicKey } = jwtDecode<TokenPayload>(cookie.value);

        await storage.set(SessionToken.ACCESS, publicKey);
      } catch (error) {
        await storage.set(SessionToken.ACCESS, null);
      }
    } else {
      storage.set(StorageKey.ACCESS_TOKEN, null);
    }
  }
);

chrome.cookies.onChanged.addListener(async function (changedInfo) {
  if (changedInfo.cookie.domain === extractDomainFromURL(UI_URL)) {
    match(changedInfo)
      .with({ removed: true, cause: P.not("overwrite") }, async () => {
        await storage.set(SessionToken.ACCESS, null);
      })
      .otherwise(async () => {
        try {
          const { publicKey } = jwtDecode<TokenPayload>(
            changedInfo.cookie.value
          );

          await storage.set(SessionToken.ACCESS, publicKey);
        } catch (error) {
          await storage.set(SessionToken.ACCESS, null);
        }
      });
  }
});
