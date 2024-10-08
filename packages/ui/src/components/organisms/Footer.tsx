import React from "react";
import Image from "next/image";

import {
  NavigationContainer,
  Facebook,
  LinkedIn,
  Logo,
  Heading4,
  Input,
} from "@repo/ui/components";
import { KumekaLogo, SolanaLogo } from "@repo/ui/assets";
import { useTranslationClient } from "@repo/i18n";

interface FooterProps {
  translationPrefix?: string;
}

export const Footer = ({ translationPrefix = "footer" }: FooterProps) => {
  const { t } = useTranslationClient();

  return (
    <footer className="py-10">
      <NavigationContainer>
        <div className="grid grid-cols-3 grid-rows-1">
          <div className="flex flex-col gap-4">
            <Logo />

            <div className="flex flex-col gap-2">
              <Heading4>{t(`${translationPrefix}.groupMember`)}</Heading4>

              <div className="flex flex-row gap-4">
                <Image
                  width={100}
                  height={100}
                  src={KumekaLogo}
                  alt="Kumeka Logo"
                />
                <Image
                  width={100}
                  height={100}
                  src={SolanaLogo}
                  alt="Solana Logo"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Heading4>{t(`${translationPrefix}.navigation.title`)}</Heading4>

            <nav className="flex flex-col gap-1">
              {(
                t(`${translationPrefix}.navigation.links`, {
                  returnObjects: true,
                }) as { title: string; href: string }[]
              ).map((link) => (
                <a
                  key={link.title}
                  className="text-primary-foreground px-8 py-2"
                  href={`#${link.href}`}
                >
                  {link.title}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <Heading4>{t(`${translationPrefix}.subscribe`)}</Heading4>

            <Input
              type="email"
              placeholder={t(`${translationPrefix}.subscribe.email`)}
            />
            <div className="flex flex-row gap-2">
              <LinkedIn />
              <Facebook />
            </div>
          </div>
        </div>

        <div className="flex justify-between py-4">
          <p className="text-primary-foreground text-xs">
            {t(`${translationPrefix}.bottom.title`)}
          </p>

          <div className="flex gap-4 justify-center">
            <p className="text-primary-foreground text-xs">
              {t(`${translationPrefix}.bottom.terms`)}
            </p>
            <p className="text-primary-foreground text-xs">
              {t(`${translationPrefix}.bottom.privacy`)}
            </p>
          </div>
        </div>
      </NavigationContainer>
    </footer>
  );
};
