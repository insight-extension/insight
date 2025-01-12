import { useEffect, useState } from "react";

import { SessionToken } from "@repo/shared/constants";

import { storage } from "@/background";
import { StorageChange } from "@/types/chrome";

export const useAccessToken = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const token = await storage.get(SessionToken.ACCESS);

      setAccessToken(token || null);
    })();

    const callbackMap = {
      [SessionToken.ACCESS]: ({ newValue }: StorageChange) => {
        if (!newValue === undefined) return;

        setAccessToken(newValue);
      }
    };

    storage.watch(callbackMap);

    return () => {
      storage.unwatch(callbackMap);
    };
  }, []);

  return {
    accessToken
  };
};
