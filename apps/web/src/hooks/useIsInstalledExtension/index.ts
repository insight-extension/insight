import { useEffect } from "react";

import { MINUTE } from "@repo/shared/constants";

export enum BrowserType {
  Edge = "Edge",
  Chrome = "Chrome",
  Brave = "Brave"
}

const CHECK_INTERVAL_TIME = MINUTE;
const EXTENSION_ID = import.meta.env.VITE_EXTENSION_ID as string;

interface UseIsInstalledExtensionProps {
  onInstalled: (isInstalled: boolean) => void;
}

export const useIsInstalledExtension = ({
  onInstalled
}: UseIsInstalledExtensionProps) => {
  // todo: complete this
  // const browserName = useMemo(
  //   () => bowserParse(window.navigator.userAgent).browser.name,
  //   []
  // );

  useEffect(() => {
    const checkExtension = async () => {
      try {
        await Promise.race([
          chrome?.runtime?.sendMessage?.(EXTENSION_ID, {
            type: "PING"
          }),
          new Promise((resolve) => setTimeout(() => resolve(true), 1000))
        ]);

        onInstalled(true);
      } catch (_error) {
        onInstalled(false);
      }
    };

    checkExtension();

    const interval = setInterval(checkExtension, CHECK_INTERVAL_TIME);

    return () => clearInterval(interval);
  }, []);
};
