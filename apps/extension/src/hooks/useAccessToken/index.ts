import { useCallback, useEffect, useState } from "react";

import { SessionToken } from "@repo/shared/constants";
import { isTokenExpired } from "@repo/shared/utils";

import { storage } from "@/background";
import { sessionManager } from "@/session/manager";
import { StorageChange } from "@/types/chrome";

export const useAccessToken = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const handleNewAccessToken = useCallback(({ newValue }: StorageChange) => {
    if (newValue === undefined) return;

    setAccessToken(newValue);
  }, []);

  useEffect(() => {
    if (
      accessToken &&
      isTokenExpired({
        token: accessToken
      })
    ) {
      (async () => {
        const refreshToken = await storage.get(SessionToken.REFRESH);

        if (refreshToken) {
          sessionManager.refreshToken(refreshToken);
        }
      })();
    }
  }, [accessToken]);

  useEffect(() => {
    (async () => {
      const token = await storage.get(SessionToken.ACCESS);

      setAccessToken(token || null);
    })();

    const callbackMap = {
      [SessionToken.ACCESS]: handleNewAccessToken
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
