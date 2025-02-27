import { memo, useCallback, useState } from "react";
import { useIntl } from "react-intl";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components";
import { useIsInstalledExtension } from "@/hooks";
import { cn } from "@/lib";

import { DownloadModalView } from "./view";

interface DownloadModalProps {
  isDefaultOpen?: boolean;
  namespace?: string;
  trigger?: React.ReactNode;
  hideOnInstall?: boolean;
  withinSection?: boolean;
}

export const DownloadModal: React.FC<DownloadModalProps> = memo(
  ({
    namespace = "features.modals.download",
    trigger,
    hideOnInstall,
    withinSection
  }) => {
    const intl = useIntl();

    const [isExtensionInstalled, setIsExtensionInstalled] =
      useState<boolean>(false);

    useIsInstalledExtension({
      onInstalled: useCallback((isInstalled) => {
        setIsExtensionInstalled(isInstalled);
      }, [])
    });

    return (
      <>
        {!isExtensionInstalled ? (
          <Dialog>
            <DialogTrigger asChild>
              {trigger ?? (
                <Button
                  variant="button-white"
                  className="h-10 cursor-pointer py-2 text-[1rem]"
                >
                  {intl.formatMessage({ id: `${namespace}.trigger` })}
                </Button>
              )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {intl.formatMessage({ id: `${namespace}.title` })}
                </DialogTitle>
              </DialogHeader>

              <DownloadModalView namespace={namespace} />
            </DialogContent>
          </Dialog>
        ) : hideOnInstall ? null : (
          <div
            className={cn(
              "button text-md flex h-10 items-center justify-center bg-purple-300",
              withinSection && "mb-5"
            )}
          >
            <p className="font-medium text-white">
              {intl.formatMessage({ id: `${namespace}.extensionInstalled` })}
            </p>
          </div>
        )}
      </>
    );
  }
);
