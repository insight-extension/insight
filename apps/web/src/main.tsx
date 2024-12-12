import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter } from "react-router";

import App from "./App.tsx";
import { AppWalletProvider } from "./providers";

import { Toaster } from "@/components";

import "./index.css";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <StrictMode>
            <CookiesProvider>
                <AppWalletProvider>
                    <Toaster />
                    <App />
                </AppWalletProvider>
            </CookiesProvider>
        </StrictMode>
    </BrowserRouter>
);
