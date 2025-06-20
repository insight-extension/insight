import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import * as Sentry from "@sentry/react";
import { RouterProvider, createRouter } from "@tanstack/react-router";

import "./index.css";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import "./sentry";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement, {
    onRecoverableError: Sentry.reactErrorHandler()
  });

  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
