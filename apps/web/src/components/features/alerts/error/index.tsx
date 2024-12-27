import React, { memo } from "react";

import {
    Alert,
    AlertTitle,
    AlertDescription,
    Icon,
    Button,
} from "@/components";
import { useLogout } from "@/hooks";

interface ErrorAlertProps {
    message: string;
    actionMessage?: string;
    title?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = memo(
    ({ message, title, actionMessage }) => {
        const logout = useLogout();

        return (
            <Alert
                variant="destructive"
                className="mx-auto flex w-fit flex-col gap-4"
            >
                <div className="flex items-center gap-2">
                    <Icon name="alertCircleIcon" className="h-4 w-4" />

                    <AlertTitle className="m-0 text-lg">{title}</AlertTitle>
                </div>

                <AlertDescription>{message}</AlertDescription>

                <Button
                    variant="button-white"
                    className="h-8 py-0 text-sm font-semibold"
                    onClick={logout}
                >
                    {actionMessage}
                </Button>
            </Alert>
        );
    }
);
