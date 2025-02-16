import { Storage } from "@plasmohq/storage";

import { SessionToken } from "@repo/shared/constants";
import { extractDomainFromURL } from "@repo/shared/utils";

import { UI_URL } from "@/constants";
import { saveCookieChangesToStorage, saveCookiesToStorage } from "@/lib/utils";

export const storage = new Storage({ area: "sync" });

chrome.cookies.getAll({ url: UI_URL }, async (cookies) =>
  saveCookiesToStorage(cookies, [SessionToken.ACCESS, SessionToken.REFRESH])
);

chrome.cookies.onChanged.addListener(async (changedInfo) =>
  saveCookieChangesToStorage(changedInfo, extractDomainFromURL(UI_URL), [
    SessionToken.ACCESS,
    SessionToken.REFRESH
  ])
);
