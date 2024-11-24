import { Storage } from "@plasmohq/storage";
import { StorageKey } from "~constants";
import { UI_URL } from "~configs";

export const storage = new Storage({ area: "sync" });

chrome.cookies.get({ url: UI_URL, name: StorageKey.ACCESS_TOKEN }, (cookie) => {
  if (cookie) {
    storage.set(StorageKey.ACCESS_TOKEN, cookie.value);
  } else {
    storage.set(StorageKey.ACCESS_TOKEN, null);
  }
});
