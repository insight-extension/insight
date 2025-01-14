import { FC, PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useIntl } from "react-intl";

import * as Sentry from "@sentry/react";

import { ErrorAlert } from "@/components";

interface AppErrorBoundaryProps extends PropsWithChildren {
  namespace?: string;
  actionNamespace?: string;
}

export const AppErrorBoundary: FC<AppErrorBoundaryProps> = ({
  namespace = "error",
  actionNamespace = "action",
  children
}) => {
  const intl = useIntl();

  return (
    <ErrorBoundary
      fallbackRender={({ error }) => {
        Sentry.captureException(error);

        return (
          <ErrorAlert
            title={intl.formatMessage({
              id: `${namespace}.unexpected`
            })}
            message={error.message}
            actionMessage={intl.formatMessage({
              id: `${actionNamespace}.reload`
            })}
          />
        );
      }}>
      {children}
    </ErrorBoundary>
  );
};
