import { ReactNode, memo, useCallback, useState } from "react";
import { useIntl } from "react-intl";

import { getRouteApi } from "@tanstack/react-router";
import { match } from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";

import { APP_SEARCH_PARAMS } from "@repo/shared/constants";
import { faucetService } from "@repo/shared/services";

import {
  DepositForm,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components";
import { useToast } from "@/hooks";
import { TRANSLATIONS } from "@/i18n";

interface DepositModalProps {
  isDefaultOpen?: boolean;
  trigger: ReactNode;
  namespace?: string;
}

export const DepositModal: React.FC<DepositModalProps> = memo(
  ({ trigger, namespace = "features.modals.depositModal" }) => {
    const { action } = getRouteApi("/").useSearch();
    const { toast } = useToast();
    const intl = useIntl();

    const [isOpen, setIsOpen] = useState<boolean>(
      action === APP_SEARCH_PARAMS.action.deposit
    );

    const handleCloseModal = useCallback(() => {
      setIsOpen(false);
    }, []);

    const faucetClaim = useCallback(() => {
      pipe(
        faucetService.claim(),
        match(
          (_error) => {
            // todo: complete error message getting
            toast({
              title: intl.formatMessage({ id: "error.failedFaucetAirdrop" }),
              description: intl.formatMessage({
                id: "error.failedFaucetAirdrop.description"
              }),
              variant: "error"
            });
          },
          (signature) =>
            toast({
              title: intl.formatMessage({ id: "success.faucetAidrop" }),
              description: signature,
              variant: "success"
            })
        )
      )();
    }, []);

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {trigger}

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{TRANSLATIONS.depositModal.trigger}</DialogTitle>
          </DialogHeader>

          <DepositForm onSuccessSubmit={handleCloseModal} />

          <button
            className="text-dark mt-4 h-10 cursor-pointer rounded bg-white font-bold"
            onClick={faucetClaim}
          >
            {intl.formatMessage({ id: `${namespace}.faucetAirdrop` })}
          </button>

          <p className="text-xs text-white">
            {intl.formatMessage({ id: `${namespace}.testUsage` })}
          </p>
        </DialogContent>
      </Dialog>
    );
  }
);
