import { FC, PropsWithChildren } from "react";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter } from "react-router";

// styles for wallet adapter
import "@solana/wallet-adapter-react-ui/styles.css";

import { Toaster } from "@/components";
import { LocalizationProvider } from "@/i18n/provider";
import { WalletAdapterProvider } from "@/providers";

interface AppProviderProps extends PropsWithChildren {}

export const AppProvider: FC<AppProviderProps> = ({ children }) => {
  return (
    <BrowserRouter>
      <WalletAdapterProvider>
        <Toaster />

        <LocalizationProvider>
          <CookiesProvider>{children} </CookiesProvider>
        </LocalizationProvider>
      </WalletAdapterProvider>
    </BrowserRouter>
  );
};
