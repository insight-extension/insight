"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

import { useTranslationClient } from "@repo/i18n";
import "@repo/tailwind/global-styles";
import { SWR_CACHE_KEY, useMutation } from "@repo/ui/fetching";
import type {
  CreateAccountRequest,
  CreateAccountResponse,
  StatusResponse,
  ValidateAccountRequest,
} from "@repo/shared/types";
import { accountService } from "@repo/shared/client/services";
import {
  About,
  FAQ,
  Features,
  Footer,
  Header,
  Hero,
} from "@repo/ui/components";

export const HomePage = () => {
  const { t } = useTranslationClient();

  const [isClientSide, setIsClientSide] = useState<boolean>(false);
  const [authenticationError, setAuthenticationError] = useState<string | null>(
    null
  );
  const [isSuccededAuthentication, setIsSuccededAuthentication] =
    useState<boolean>(false);
  const { publicKey, connected, signMessage } = useWallet();

  const { trigger: createAccount, error: createAccountError } = useMutation<
    CreateAccountRequest,
    CreateAccountResponse
  >({
    key: SWR_CACHE_KEY.CreateAccount,
    mutateFn: accountService.createAccount,
  });

  const { trigger: validateAccount, error: validateAccountError } = useMutation<
    ValidateAccountRequest,
    StatusResponse
  >({
    key: SWR_CACHE_KEY.ValidateAccount,
    mutateFn: accountService.validateAccount,
  });

  useEffect(() => {
    setIsClientSide(true);
  }, []);

  useEffect(() => {
    if (createAccountError) {
      setAuthenticationError(createAccountError.message);
    }
  }, [createAccountError]);

  useEffect(() => {
    if (validateAccountError) {
      setAuthenticationError(validateAccountError.message);
    }
  }, [validateAccountError]);

  useEffect(() => {
    (async () => {
      if (publicKey && connected && signMessage) {
        try {
          const publicKeyBase58 = publicKey.toBase58();

          const { nonce } = await createAccount({
            publicKey: publicKeyBase58,
          });

          if (nonce) {
            const signatureResponse = await accountService.createSignature({
              nonce,
              signMessageFn: signMessage,
            });

            if (signatureResponse) {
              const { status } = await validateAccount({
                publicKey: publicKeyBase58,
                signature: signatureResponse.signature,
              });

              if (status) {
                setIsSuccededAuthentication(true);
              }
            }
          }
        } catch (error: any) {
          setAuthenticationError(error.message);
        }
      }
    })();
  }, [publicKey, connected, signMessage]);

  useEffect(() => {}, [connected, publicKey, signMessage]);

  return (
    <main className="flex flex-col min-h-screen bg-[url('/background.png')] bg-cover">
      {/* <div className="flex flex-row">
        {isClientSide ? (
          <div className="indicator h-fit">
            <span
              className={`indicator-item badge ${connected ? "badge-primary" : "badge-secondary"}`}
            />
            <WalletMultiButton style={{}} />
          </div>
        ) : (
          <div className="flex w-24 items-center">
            <span className="loading loading-dots loading-md" />
          </div>
        )}
      </div> */}

      {authenticationError && (
        <div role="alert" className="alert alert-error">
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

      <Header />
      <Hero />
      <About />
      <Features />
      <FAQ />
      <Footer />
    </main>
  );
};
