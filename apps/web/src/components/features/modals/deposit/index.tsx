import { ReactNode, memo, useCallback, useState } from "react";

import { APP_SEARCH_PARAMS } from "@repo/shared/constants";

import {
  DepositForm,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components";
import { useSearchParamValue } from "@/hooks";
import { TRANSLATIONS } from "@/i18n";

interface DepositModalProps {
  isDefaultOpen?: boolean;
  trigger: ReactNode;
}

export const DepositModal: React.FC<DepositModalProps> = memo(({ trigger }) => {
  const action = useSearchParamValue("action");
  const [isOpen, setIsOpen] = useState<boolean>(
    action === APP_SEARCH_PARAMS.action.deposit
  );

  const handleCloseModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger}

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{TRANSLATIONS.depositModal.trigger}</DialogTitle>
        </DialogHeader>

        <DepositForm onSuccessSubmit={handleCloseModal} />
      </DialogContent>
    </Dialog>
  );
});
