import { useCallback, useEffect, useState } from "react";

import "https://www.googletagmanager.com/gtag/js?id=$PLASMO_PUBLIC_GTAG_ID";

import { GTMEvent } from "./events";

export const useGTM = (pagePath: "/popup" | "/sidepanel") => {
  const [gtagEvent, setGtagEvent] = useState<{
    event: GTMEvent;
    data: any;
  } | null>(null);

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", process.env.PLASMO_PUBLIC_GTAG_ID, {
      page_path: pagePath,
      debug_mode: true
    });
  }, []);
};
