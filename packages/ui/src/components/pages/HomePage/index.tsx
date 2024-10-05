import { useState, useEffect, useMemo } from "react";

import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import "@repo/tailwind/global-styles";
import { useTranslationClient } from "@repo/i18n";

const network = WalletAdapterNetwork.Devnet;

export const HomePage = () => {
  const { t } = useTranslationClient();

  const [isConnected, setIsConnected] = useState(false);
  const [gameError, setGameError] = useState("");
  const [gameAccountPublicKey, setGameAccountPublicKey] = useState("");

  const { connected } = useWallet();
  const wallet = useAnchorWallet();

  const endpoint = useMemo(() => clusterApiUrl(network), []);

  return (
    <div className="flex items-center flex-col sm:p-4 p-1">
      {/* todo: implement internationalisation with routing  */}
      {/* <LanguageSwitcher currentLanguage={language} /> */}
    </div>
  );
};
