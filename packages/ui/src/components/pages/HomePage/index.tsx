"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

import { useTranslationClient } from "@repo/i18n";
import "@repo/tailwind/global-styles";
import { useEffect, useState } from "react";

export const HomePage = () => {
  const { t } = useTranslationClient();

  const [isClientSide, setIsClientSide] = useState<boolean>(false);

  const { publicKey, connected } = useWallet();

  useEffect(() => {
    setIsClientSide(true);
  }, []);

  useEffect(() => {
    if (publicKey && connected) {
      console.log("Public Key:", publicKey?.toBase58());
    }
  }, [publicKey, connected]);

  return (
    <main className="flex flex-row justify-between min-h-screen p-10">
      <h1 className="text-4xl mb-4 font-bold">{t("home.applicationTitle")}</h1>

      <div>
        {isClientSide ? (
          <div className="indicator h-fit">
            <span
              className={`indicator-item badge ${connected ? "badge-primary" : "badge-secondary"}`}
            />
            <WalletMultiButton style={{}} />
          </div>
        ) : (
          <div className="flex w-24 items-center">
            <span className="loading loading-dots loading-md"></span>
          </div>
        )}
      </div>
    </main>
  );
};
