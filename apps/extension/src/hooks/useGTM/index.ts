import { useEffect } from "react";

import "https://www.googletagmanager.com/gtag/js?id=$PLASMO_PUBLIC_GTAG_ID";

export const useGTM = () => {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", process.env.PLASMO_PUBLIC_GTAG_ID, {
      page_path: "/popup",
      debug_mode: true
    });

    // todo: use required event
    // window.gtag("event", "login", {
    //   method: "TEST"
    // });
  }, []);
};
