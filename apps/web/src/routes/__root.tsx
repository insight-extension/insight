import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { AppErrorBoundary } from "@/app/boundary";
import { AppLoading } from "@/app/loading";
import { AppProvider } from "@/app/provider";

export const Route = createRootRoute({
  component: () => (
    <>
      <AppProvider>
        <AppLoading>
          <AppErrorBoundary>
            <Outlet />
          </AppErrorBoundary>
        </AppLoading>
      </AppProvider>

      <TanStackRouterDevtools />
    </>
  )
});
