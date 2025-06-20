import { P, match } from "ts-pattern";

import { storage } from "@/background";

export const saveCookieChangesToStorage = async (
  changedInfo: chrome.cookies.CookieChangeInfo,
  domain: string | null,
  keys: string[]
) => {
  if (!domain) return;

  const {
    cookie: { domain: cookieDomain, name: cookieName, value }
  } = changedInfo;

  if (cookieDomain === domain && keys.includes(cookieName)) {
    match(changedInfo)
      .with(
        { removed: true, cause: P.not("overwrite") },
        async () => await storage.set(cookieName, null)
      )
      .otherwise(() => storage.set(cookieName, value));
  }
};

export const saveCookiesToStorage = async (
  cookies: chrome.cookies.Cookie[],
  keys: string[]
) => {
  for (const cookie of cookies) {
    if (keys.includes(cookie.name)) {
      await storage.set(cookie.name, cookie.value);
    }
  }
};
