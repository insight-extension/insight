"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import "@solana/wallet-adapter-react-ui/styles.css";

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
  Alert,
  AlertDescription,
  AlertTitle,
  Container,
  FAQ,
  Features,
  Footer,
  Header,
  Hero,
} from "@repo/ui/components";
import { TriangleAlert } from "lucide-react";
import { useTranslationClient } from "@repo/i18n";

interface HomePageProps {
  translationPrefix?: string;
}

export const HomePage = ({ translationPrefix = "home" }: HomePageProps) => {
  const { t } = useTranslationClient();

  const [authenticationError, setAuthenticationError] = useState<string | null>(
    null
  );
  const [_, setIsSuccededAuthentication] = useState<boolean>(false);
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
      <Header connected={connected} />

      {authenticationError && (
        <Container>
          <Alert variant="destructive">
            <TriangleAlert className="h-4 w-4" />

            <AlertTitle>
              {t(`${translationPrefix}.authenticationError.title`)}
            </AlertTitle>

            <AlertDescription>
              {t(`${translationPrefix}.authenticationError.message`)}
            </AlertDescription>
          </Alert>
        </Container>
      )}

      <Hero />
      <About />
      <Features />
      <FAQ />
      <Footer />
    </main>
  );
};
