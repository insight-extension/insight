import { CookiesProvider } from "react-cookie";
import { BrowserRouter } from "react-router";
import { FC, PropsWithChildren, Suspense } from "react";

import { AppWalletProvider } from "@/providers";
import { Loader, Toaster } from "@/components";

interface AppProviderProps extends PropsWithChildren {}

export const AppProvider: FC<AppProviderProps> = ({ children }) => {
    return (
        <Suspense fallback={<Loader withContainer />}>
            <BrowserRouter>
                <CookiesProvider>
                    <AppWalletProvider>
                        <Toaster />

                        {children}
                    </AppWalletProvider>
                </CookiesProvider>
            </BrowserRouter>
        </Suspense>
    );
};
