import React, { memo } from "react";

import { Alert, AlertTitle, AlertDescription, Icon } from "@/components";

interface ErrorAlertProps {
    message: string;
    title?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = memo(
    ({ message, title }) => {
        return (
            <Alert variant="destructive" className="mx-auto w-fit">
                <Icon name="alertCircleIcon" className="h-4 w-4" />

                <AlertTitle>{title}</AlertTitle>

                <AlertDescription>{message}</AlertDescription>
            </Alert>
        );
    }
);
