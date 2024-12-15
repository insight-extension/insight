import { memo, ReactNode, useCallback, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DepositForm,
} from "@/components";
import { TRANSLATIONS } from "@/i18n";

interface DepositModalProps {
    isDefaultOpen?: boolean;
    trigger: ReactNode;
}

export const DepositModal: React.FC<DepositModalProps> = memo(
    ({ isDefaultOpen = false, trigger }) => {
        const [isOpen, setIsOpen] = useState<boolean>(false);

        const handleCloseModal = useCallback(() => {
            setIsOpen(false);
        }, []);

        return (
            <Dialog
                defaultOpen={isDefaultOpen}
                open={isOpen}
                onOpenChange={setIsOpen}
            >
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
