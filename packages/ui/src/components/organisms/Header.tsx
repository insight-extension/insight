import React from "react";

import { useTranslationClient } from "@repo/i18n";
import { Logo, Button } from "@repo/ui/components";

interface HeaderProps {
  translationPrefix?: string;
}

export const Header = ({ translationPrefix = "header" }: HeaderProps) => {
  const { t } = useTranslationClient();

  return (
    <header className="flex flew-row flex-wrap justify-between items-center px-24 py-4">
      <Logo />

      <nav className="flex justify-end">
        {(
          t(`${translationPrefix}.links`, {
            returnObjects: true,
          }) as string[]
        ).map((link) => (
          <a
            key={link}
            className="text-primary-foreground px-8 py-2"
            href={link}
          >
            {link}
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
    </header>
  );
};
