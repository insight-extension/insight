import { BrowserRouter } from "react-router";
import { FC, PropsWithChildren } from "react";
import { CookiesProvider } from "react-cookie";

import { AppWalletProvider } from "@/providers";
import { Toaster } from "@/components";
import { LocalizationProvider } from "@/i18n/provider";

interface AppProviderProps extends PropsWithChildren {}

export const AppProvider: FC<AppProviderProps> = ({ children }) => {
    return (
        <BrowserRouter>
            <CookiesProvider>
                <AppWalletProvider>
                    <Toaster />

                    <LocalizationProvider>{children}</LocalizationProvider>
                </AppWalletProvider>
            </CookiesProvider>
        </BrowserRouter>
    );
};
