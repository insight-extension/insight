import { FC, PropsWithChildren } from "react";
import { useIntl } from "react-intl";
import { ErrorBoundary } from "react-error-boundary";

import { ErrorAlert } from "@/components";

interface AppErrorBoundaryProps extends PropsWithChildren {
    namespace?: string;
}

export const AppErrorBoundary: FC<AppErrorBoundaryProps> = ({
    namespace = "error",
    children,
}) => {
    const intl = useIntl();

    return (
        <ErrorBoundary
            fallbackRender={({ error }) => (
                <ErrorAlert
                    title={intl.formatMessage({
                        id: `${namespace}.unexpected`,
                    })}
                    message={error.message}
                    actionMessage={intl.formatMessage({
                        id: `${namespace}.action.reload`,
                    })}
                />
            )}
        >
            {children}
        </ErrorBoundary>
    );
};
