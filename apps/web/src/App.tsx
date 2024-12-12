import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import { useCookies } from "react-cookie";
import { useSetAtom } from "jotai";
import {
    useConnection,
    useWallet,
    useAnchorWallet,
} from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { AnchorProvider } from "@coral-xyz/anchor";

import { Hero } from "./components/sections/Hero";
import { HowItWorks } from "./components/sections/HowItWorks";
import { WhyOur } from "./components/sections/WhyOur";
import { Web3Community } from "./components/sections/We3Community";
import { Prices } from "./components/sections/Prices";
import { Faqs } from "./components/sections/Faqs";
import { Comments } from "./components/sections/Comments";
import { Footer } from "./components/sections/Footer";
import { CacheKey, useMutation } from "./fetching";
import { authService } from "./services";
import { StorageKey } from "./constants";
import { TRANSLATIONS } from "./i18n";
import { cn, isTokenExpired } from "@/lib";
import { anchorProviderAtom } from "@/store";

const Header = lazy(() => import("./components/Header"));
const MobileHeader = lazy(() => import("./components/MobileHeader"));

// todo: use RTR: https://tanstack.com/router/v1/docs/framework/react/quick-start
// https://tanstack.com/router/latest/docs/framework/react/comparison
// todo: change button to solana wallet button

const BREAKPOINT_WIDTH = 1023;

const App = () => {
    const { connection } = useConnection();
    const { publicKey, connected, signMessage } = useWallet();
    const setAnchorProvider = useSetAtom(anchorProviderAtom);

    const wallet = useAnchorWallet();

    const { width } = useWindowSize();

    const [cookies, setCookie] = useCookies([
        StorageKey.ACCESS_TOKEN,
        StorageKey.REFRESH_TOKEN,
    ]);

    const accessToken = cookies[StorageKey.ACCESS_TOKEN];
    const refreshToken = cookies[StorageKey.REFRESH_TOKEN];

    // todo: review flow
    const shouldVerifyAccount = !accessToken;
    const shouldRefreshToken = isTokenExpired(accessToken);

    const [authenticationError, setAuthenticationError] = useState<
        string | null
    >(null);

    const { trigger: claimNonce, error: claimNonceError } = useMutation({
        key: CacheKey.CLAIM_NONCE,
        mutateFn: authService.claimNonce,
    });

    const { trigger: verifyAccount, error: verifyAccountError } = useMutation({
        key: CacheKey.VERIFY_ACCOUNT,
        mutateFn: authService.verifyAccount,
    });

    const { trigger: refresh, error: refreshError } = useMutation({
        key: CacheKey.REFRESH_TOKEN,
        mutateFn: authService.refreshToken,
    });

    const handleTokenRefresh = useCallback(async () =>
        // add params
        {
            if (isTokenExpired(refreshToken) || !refreshToken) {
                // authenticationError = "Refresh token is expired or missing";
                throw new Error("Refresh token is expired or missing");
            }

            const { data: refreshTokenResponse } = await refresh({
                refreshToken,
            });

            if (!refreshTokenResponse) {
                return;
            }

            setCookie(
                StorageKey.ACCESS_TOKEN,
                refreshTokenResponse.accessToken
            );
            setCookie(
                StorageKey.REFRESH_TOKEN,
                refreshTokenResponse.refreshToken
            );
        }, [refreshToken]);

    const handleSaveTokens = useCallback(
        async ({
            publicKey,
            signMessage,
        }: {
            publicKey: PublicKey;
            signMessage: (message: Uint8Array) => Promise<Uint8Array>;
        }) => {
            const { data: nonceResponse } = await claimNonce({ publicKey });

            if (!nonceResponse) {
                return;
            }

            const signatureResponse = await authService.createSignature({
                nonce: nonceResponse.nonce,
                signMessageFn: signMessage,
            });

            if (!signatureResponse) {
                setAuthenticationError(TRANSLATIONS.createSignatureError);

                return;
            }

            const { data: accountResponse } = await verifyAccount({
                publicKey,
                signature: signatureResponse.signature,
            });

            if (!accountResponse) {
                return;
            }

            setCookie(StorageKey.ACCESS_TOKEN, accountResponse.accessToken);
            setCookie(StorageKey.REFRESH_TOKEN, accountResponse.refreshToken);
        },
        [shouldVerifyAccount, publicKey, signMessage]
    );

    useEffect(() => {
        if (connection && wallet) {
            setAnchorProvider(new AnchorProvider(connection, wallet));
        }
    }, [connection, wallet]);

    useEffect(() => {
        if (!connected && authenticationError) {
            setAuthenticationError(null);
        }
    }, [connected]);

    useEffect(() => {
        if (refreshError) {
            setAuthenticationError(TRANSLATIONS.unexpectedError);
        }
    }, [refreshError]);

    useEffect(() => {
        if (verifyAccountError || claimNonceError) {
            setAuthenticationError(TRANSLATIONS.verifyAccountError);
        }
    }, [verifyAccountError, claimNonceError]);

    useEffect(() => {
        if (shouldVerifyAccount && publicKey && signMessage) {
            (async () => {
                await handleSaveTokens({ publicKey, signMessage });
            })();
        }
    }, [shouldVerifyAccount, publicKey, signMessage]);

    useEffect(() => {
        if (shouldRefreshToken) {
            (async () => {
                await handleTokenRefresh();
            })();
        }
    }, [shouldRefreshToken]);

    return (
        <Suspense
            fallback={
                <div className="flex h-screen w-screen items-center justify-center">
                    <div className="loading loading-bars loading-lg" />
                </div>
            }
        >
            {width && width > BREAKPOINT_WIDTH ? <Header /> : <MobileHeader />}

            {authenticationError && (
                <div
                    role="alert"
                    className={cn(
                        "alert alert-error",
                        "max-w-screen-sm",
                        "mx-auto my-12 p-6",
                        "text-lg"
                    )}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>

                    <span>{authenticationError}</span>
                </div>
            )}

            <Hero />
            <HowItWorks />
            <WhyOur />
            <Web3Community />
            <Prices />
            <Faqs />
            <Comments />
            <Footer />
        </Suspense>
    );
};

export default App;
