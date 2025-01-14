import { useCallback, useState } from "react";

import { chain, left, mapLeft, right, tryCatch } from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";
import { P, match } from "ts-pattern";

import { InvalidTabIdError, QueringTabError } from "./errors";
import { UseExtensionControls } from "./types";

export const useExtensionControls = (): UseExtensionControls => {
  const [sidepanelError, setSidepanelError] = useState<
    UseExtensionControls["sidepanelError"] | null
  >(null);
  const close = useCallback(() => window.close(), []);

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
      chain(() => right(close())),
      mapLeft((error) => {
        setSidepanelError(error);
      })
    )();
  }, []);

  return {
    openSidePanel,
    close,
    sidepanelError
  };
};
