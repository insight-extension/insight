import { useState, useEffect, useMemo } from "react";

import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import { LeaderboardItem, anchorCLient } from "@repo/ui/anchor-client";
import { LanguageSwitcher, Leaderboard } from "@repo/ui/components";
import "@repo/tailwind/global-styles";
import { useTranslationClient } from "@repo/i18n";

import {
  Header,
  CTA,
  Footer,
  Testimonials,
  Services,
  Hero,
} from "../../landing";

const network = WalletAdapterNetwork.Devnet;

export const HomePage = ({ language }: { language: string }) => {
  const { t } = useTranslationClient(language);

  const [clicks, setClicks] = useState(0);
  const [effect, setEffect] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isGameReady, setIsGameReady] = useState(false);
  const [solanaExplorerLink, setSolanaExplorerLink] = useState("");
  const [gameError, setGameError] = useState("");
  const [gameAccountPublicKey, setGameAccountPublicKey] = useState("");
  const [leaders, setLeaders] = useState<LeaderboardItem[]>([]);
  const [isClientSide, setIsClientSide] = useState(false);

  const { connected } = useWallet();
  const wallet = useAnchorWallet();

  const endpoint = useMemo(() => clusterApiUrl(network), []);

  useEffect(() => {
    setIsConnected(connected);

    (async () => {
      if (wallet) {
        const gameState = await anchorCLient.getCurrentGame({
          wallet,
          endpoint,
        });
        setIsGameReady(connected && gameState.isReady);
        setClicks(gameState.clicks);
        setGameAccountPublicKey(gameState.gameAccountPublicKey);
        setSolanaExplorerLink(
          `https://explorer.solana.com/address/${gameAccountPublicKey}/anchor-account?cluster=${network}`
        );
        setGameError(gameState.errorMessage);
      } else {
        setIsGameReady(false);
        setClicks(0);
        setGameAccountPublicKey("");
        setSolanaExplorerLink("");
        setGameError("");
      }
    })();
  }, [connected, endpoint, wallet, gameAccountPublicKey]);

  // airdrop test SOL if on devnet and player has less than 1 test SOL
  useEffect(() => {
    (async () => {
      if (wallet) {
        try {
          await anchorCLient.airdrop({ wallet, endpoint });
        } catch (error: any) {
          throw new Error(
            `Unable to airdrop 1 test SOL due to ${error.message}`
          );
        }
      }
    })();
  }, [connected, wallet, endpoint]);

  // for leaderboard, persist expensive "retrieve all game data" via useState()
  useEffect(() => {
    (async () => {
      if (wallet) {
        setLeaders(await anchorCLient.getLeaderboard({ wallet, endpoint }));
      }
    })();
  }, [wallet, endpoint]);

  useEffect(() => {
    setIsClientSide(true);
  }, []);

  return (
    <div className="flex items-center flex-col sm:p-4 p-1">
      <LanguageSwitcher currentLanguage={language} />

      <div className="navbar mb-2 bg-base-300 text-base-content rounded-box sm:p-4">
        <div className="flex-1 text-xl font-mono">
          {isClientSide && t("home.applicationTitle")}
        </div>

        <div>
          <WalletMultiButton />
        </div>

        <div className="badge badge-primary badge-outline flex-none ml-2">
          {network}
        </div>
      </div>

      <div>
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="p-4 flex flex-col items-center gap-3">
            {!isConnected && (
              <p className="p-2 text-center">
                To play game, please click{" "}
                <span className="font-bold">Select Wallet</span> above to choose
                your Solana wallet.
              </p>
            )}
          </div>
        </div>
      </div>

      <Header />
      <Hero />
      <Services />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};
