import React from "react";

import { useTranslationClient } from "@repo/i18n";
import { Logo, Button, NavigationContainer } from "@repo/ui/components";

interface HeaderProps {
  translationPrefix?: string;
}

export const Header = ({ translationPrefix = "header" }: HeaderProps) => {
  const { t } = useTranslationClient();

  return (
    <header className="py-4">
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
          <Button variant="default" className="w-52">
            {t(`${translationPrefix}.connectWallet`)}
          </Button>

          <Button className="w-52" variant="accent">
            {t(`${translationPrefix}.start`)}
          </Button>
        </div>
      </NavigationContainer>
    </header>
  );
};
