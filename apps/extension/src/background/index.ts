import { Storage } from "@plasmohq/storage";

import { StorageKey } from "~constants";
import { UI_URL } from "~configs";

import { SessionToken } from "@repo/ui/constants";

export const storage = new Storage({ area: "sync" });

chrome.cookies.get({ url: UI_URL, name: SessionToken.ACCESS }, (cookie) => {
  if (cookie) {
    console.log("Access token found in cookies", cookie.value);
    storage.set(StorageKey.ACCESS_TOKEN, cookie.value);
  } else {
    storage.set(StorageKey.ACCESS_TOKEN, null);
  }
});

//how to listen to cookie changes
//use relay instead of this?
//when remove listen to cookie changes
chrome.cookies.getAll({ url: UI_URL }, (cookies) => {
  if (cookies) {
    console.log("COOKIES", cookies);
  }
});
