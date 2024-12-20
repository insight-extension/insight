import React from "react";

import { useTranslationClient } from "@repo/i18n";
import { Heading1, Button, Container } from "@repo/ui/components";

interface HeroProps {
  translationPrefix?: string;
}

export const Hero = ({ translationPrefix = "hero" }: HeroProps) => {
  const { t } = useTranslationClient();

  // todo: replace with actual supported browsers
  const getSupportedBrowsers = () => ["Chrome", "Firefox", "Safari"];

  return (
    <section className="pt-24 pb-40">
      <Container>
        <div className="max-w-[35rem]">
          <Heading1 className="leading-[5rem] mb-2">
            {t(`${translationPrefix}.title`)}
          </Heading1>

          <p className="text-lg font-medium text-primary-foreground mb-10">
            {t(`${translationPrefix}.available`)}
            {getSupportedBrowsers().join(", ")}
          </p>

          <Button className="w-84 h-20 text-2xl" size="lg" variant="gradient">
            {t(`${translationPrefix}.download`)}
          </Button>
        </div>
      </Container>
    </section>
  );
};

// todo
//desifn resoluion and sizes fix
