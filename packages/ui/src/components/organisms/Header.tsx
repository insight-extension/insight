import React, { useEffect, useState } from "react";

import { useTranslationClient } from "@repo/i18n";
import { Logo, Button, NavigationContainer } from "@repo/ui/components";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

interface HeaderProps {
  connected: boolean;
  translationPrefix?: string;
}

export const Header = ({
  translationPrefix = "header",
  connected,
}: HeaderProps) => {
  const { t } = useTranslationClient();

  const [isClientSide, setIsClientSide] = useState<boolean>(false);

  useEffect(() => {
    setIsClientSide(true);
  }, []);

  return (
    <header className="py-10">
      <NavigationContainer className="flex flew-row flex-wrap justify-between items-center">
        <Logo />

        <nav className="flex justify-end">
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

        <div className="flex gap-8">
          <Button className="w-40 h-12 text-md" variant="accent">
            {t(`${translationPrefix}.start`)}
          </Button>

          {isClientSide ? (
            <div className="indicator h-fit">
              <span
                className={`indicator-item badge ${connected ? "badge-primary" : "badge-secondary"}`}
              />
              <WalletMultiButton
                style={{
                  background: "hsl(var(--primary-foreground))",
                  color: "hsl(var(--primary))",
                  height: "3rem",
                  fontFamily: "stolzl, sans-serif",
                  textAlign: "center",
                  fontWeight: 500,
                }}
              />
            </div>
          ) : (
            <div className="flex w-24 items-center">
              <span className="loading loading-dots loading-md" />
            </div>
          )}
        </div>
      </NavigationContainer>
    </header>
  );
};
