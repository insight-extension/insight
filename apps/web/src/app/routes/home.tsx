import { lazy, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useIntl } from "react-intl";

import { useWallet } from "@solana/wallet-adapter-react";
import { useAtom } from "jotai";

import { SessionToken } from "@repo/shared/constants";

import {
  Comments,
  ErrorAlert,
  Faqs,
  Footer,
  Hero,
  HowItWorks,
  Prices,
  Web3Community,
  WhyOur
} from "@/components";
import { useAuthentication, useSetupAnchorProvider } from "@/hooks";
import { isTokenExpired } from "@/lib";
import { walletSelectionAtom } from "@/store";

const Header = lazy(() => import("@/components/sections/Header"));
const MobileHeader = lazy(() => import("@/components/sections/MobileHeader"));

export const Home = () => {
  const intl = useIntl();

  const [cookies] = useCookies([SessionToken.ACCESS]);

  const [isWalletSelected, setIsWalletSelected] = useAtom(walletSelectionAtom);

  const { connected, publicKey, signMessage } = useWallet();

  const {
    authenticate,
    tokenRefresh,
    errorMessage: authenticationErrorMessage
  } = useAuthentication();

  useSetupAnchorProvider();

  useEffect(() => {
    if (isWalletSelected && connected && publicKey && signMessage) {
      authenticate({ publicKey, signMessage });

      setIsWalletSelected(false);
    }
  }, [connected, isWalletSelected, publicKey, signMessage]);

  useEffect(() => {
    const accessToken = cookies.accessToken;

    if (
      accessToken &&
      isTokenExpired({
        token: accessToken
      })
    ) {
      tokenRefresh();
    }
  }, [cookies]);

  return (
    <>
      <Header className="hidden lg:flex" />
      <MobileHeader className="block lg:hidden" />

      {authenticationErrorMessage && (
        <ErrorAlert
          title={intl.formatMessage({ id: "error.authentication" })}
          message={authenticationErrorMessage}
          actionMessage={intl.formatMessage({ id: "action.retry" })}
        />
      )}

      <Hero />
      <HowItWorks />
      <WhyOur />
      <Web3Community />
      <Prices />
      <Faqs />
      <Comments />

      <Footer />
    </>
  );
};
