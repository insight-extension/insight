import React from "react";
import Image from "next/image";
import Link from "next/link";

import {
  NavigationContainer,
  Logo,
  Heading4,
  Input,
} from "@repo/ui/components";
import { KumekaLogo, SolanaLogo, Twitter, LinkedIn } from "@repo/ui/assets";
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
          <div className="flex flex-col gap-8">
            <Logo />

            <div className="flex flex-col gap-3">
              <Heading4>{t(`${translationPrefix}.groupMember`)}</Heading4>

              <div className="flex flex-row gap-4">
                <Link href="https://solana.com/">
                  <Image
                    quality={100}
                    width={40}
                    height={40}
                    src={SolanaLogo}
                    alt="Solana Logo"
                  />
                </Link>

                <Link href="https://www.linkedin.com/company/kumeka-team/">
                  <Image
                    quality={100}
                    style={{ objectFit: "cover" }}
                    width={40}
                    height={40}
                    src={KumekaLogo}
                    alt="Kumeka Logo"
                  />
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <Heading4 className="text-xl">
              {t(`${translationPrefix}.navigation.title`)}
            </Heading4>

            <nav className="flex flex-col gap-6">
              {(
                t(`${translationPrefix}.navigation.links`, {
                  returnObjects: true,
                }) as { title: string; href: string }[]
              ).map((link) => (
                <a
                  key={link.title}
                  className="text-primary-foreground"
                  href={`#${link.href}`}
                >
                  {link.title}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-8">
            <Heading4 className="text-xl">
              {t(`${translationPrefix}.subscribe.title`)}
            </Heading4>

            <Input
              className="h-16 text-lg px-6 text-primary-foreground"
              type="email"
              placeholder={t(`${translationPrefix}.subscribe.email`)}
            />
            <div className="flex flex-row gap-3">
              <Link href="https://x.com/1nsight_xyz">
                <Image height={30} width={30} src={Twitter} alt="Twitter" />
              </Link>

              <Link href="https://www.linkedin.com/company/insight-xyz">
                <Image height={32} width={32} src={LinkedIn} alt="Twitter" />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex justify-between py-4">
          <p className="text-primary-foreground text-xs">
            {t(`${translationPrefix}.bottom.title`)}
          </p>

          <div className="flex gap-8 justify-center">
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
