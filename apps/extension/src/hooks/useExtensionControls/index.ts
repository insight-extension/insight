import { useCallback } from "react";

import { left, mapLeft, tryCatch } from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";
import { P, match } from "ts-pattern";

import { InvalidTabIdError, QueringTabError } from "./errors";

export const useExtensionControls = () => {
  const openSidePanel = useCallback(async () => {
    pipe(
      tryCatch(
        async () => {
          const [tab] = await chrome.tabs.query({
            active: true,
            lastFocusedWindow: true
          });

          match(tab)
            .with({ id: P.intersection(P.number, P.select()) }, async (id) => {
              await chrome.sidePanel.open({ tabId: id });

              await chrome.sidePanel.setOptions({
                tabId: id,
                path: "sidepanel.html",
                enabled: true
              });
            })
            .otherwise(() => left(new InvalidTabIdError()));
        },
        (error: any) => left(new QueringTabError(error.message))
      ),
      mapLeft((error) => {
        throw error;
      })
    )();
  }, []);

  const close = useCallback(() => window.close(), []);

  return {
    openSidePanel,
    close
  };
};
