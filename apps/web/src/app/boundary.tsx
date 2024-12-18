import { FC, PropsWithChildren } from "react";
import { useIntl } from "react-intl";
import { ErrorBoundary } from "react-error-boundary";

import { ErrorAlert } from "@/components";

interface AppErrorBoundaryProps extends PropsWithChildren {}

export const AppErrorBoundary: FC<AppErrorBoundaryProps> = ({ children }) => {
    const intl = useIntl();

    return (
        <ErrorBoundary
            fallbackRender={({ error }) => (
                <ErrorAlert
                    title={intl.formatMessage({
                        id: "error.unexpected",
                    })}
                    message={error.message}
                />
            )}
        >
            {children}
        </ErrorBoundary>
    );
};
