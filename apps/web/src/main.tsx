import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import * as Sentry from "@sentry/react";

import { App } from "@/app";

import "./index.css";
import "./sentry";

createRoot(document.getElementById("root")!, {
  onRecoverableError: Sentry.reactErrorHandler()
}).render(
  <StrictMode>
    <App />
  </StrictMode>
);
