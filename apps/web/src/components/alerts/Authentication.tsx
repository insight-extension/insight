import React, { memo } from "react";

import { Alert, AlertTitle, AlertDescription, Icon } from "@/components";

interface AuthenticationAlertProps {
    message: string;
    title?: string;
}

export const AuthenticationAlert: React.FC<AuthenticationAlertProps> = memo(
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
