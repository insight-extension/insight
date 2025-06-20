import { Outlet, createRootRoute } from "@tanstack/react-router";

import { AppErrorBoundary } from "@/app/boundary";
import { Devtools } from "@/app/devtools";
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

      <Devtools />
    </>
  )
});
