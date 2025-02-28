import { memo, useCallback, useState } from "react";
import { useIntl } from "react-intl";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components";
import { useIsInstalledExtension } from "@/hooks";

import { DownloadModalView } from "./view";

interface DownloadModalProps {
  isDefaultOpen?: boolean;
  namespace?: string;
  trigger: React.ReactNode;
  hideOnInstall?: boolean;
  withinSection?: boolean;
  success: React.ReactNode;
}

export const DownloadModal: React.FC<DownloadModalProps> = memo(
  ({
    namespace = "features.modals.download",
    trigger,
    hideOnInstall,
    success
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
            <DialogTrigger asChild>{trigger}</DialogTrigger>

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
          success
        )}
      </>
    );
  }
);
