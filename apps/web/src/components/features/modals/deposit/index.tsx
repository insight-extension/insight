import { memo, ReactNode, useCallback, useEffect, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DepositForm,
} from "@/components";
import { TRANSLATIONS } from "@/i18n";
import { useSearchParamValue } from "@/hooks";
import { SEARCH_PARAMS } from "@/constants";

interface DepositModalProps {
    isDefaultOpen?: boolean;
    trigger: ReactNode;
}

export const DepositModal: React.FC<DepositModalProps> = memo(
    ({ isDefaultOpen = false, trigger }) => {
        const action = useSearchParamValue("action");
        const [isOpen, setIsOpen] = useState<boolean>(
            action === SEARCH_PARAMS.action.deposit
        );

        const handleCloseModal = useCallback(() => {
            setIsOpen(false);
        }, []);

        useEffect(() => {
            console.log("isDefaultOpen", isDefaultOpen);
        }, [isDefaultOpen]);

        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                {trigger}

                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {TRANSLATIONS.depositModal.trigger}
                        </DialogTitle>
                    </DialogHeader>

                    <DepositForm onSuccessSubmit={handleCloseModal} />
                </DialogContent>
            </Dialog>
        );
    }
);
