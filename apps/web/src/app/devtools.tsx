import { Suspense, lazy } from "react";

export const Devtools = () => {
  const TanStackRouterDevtools =
    process.env.VITE_MODE === "development"
      ? lazy(() =>
          import("@tanstack/router-devtools").then((res) => ({
            default: res.TanStackRouterDevtools
          }))
        )
      : () => null;

  return (
    <Suspense>
      <TanStackRouterDevtools />
    </Suspense>
  );
};
