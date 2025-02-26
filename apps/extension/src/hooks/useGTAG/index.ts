import { useEffect } from "react";

import "https://www.googletagmanager.com/gtag/js?id=$PLASMO_PUBLIC_GTAG_ID";

const GTAG_ID = process.env.PLASMO_PUBLIC_GTAG_ID;

export const useInitGTAG = (pagePath: "/popup" | "/sidepanel") => {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", GTAG_ID, {
      page_path: pagePath,
      debug_mode: true
    });
  }, []);
};
