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
    <section className="py-40">
      <Container>
        <div className="max-w-96">
          <Heading1 className="leading-[3rem] mb-2">
            {t(`${translationPrefix}.title`)}
          </Heading1>

          <p className="text-sm font-medium text-primary-foreground mb-10">
            {t(`${translationPrefix}.available`)}
            {getSupportedBrowsers().join(", ")}
          </p>

          <Button className="w-52" size="lg" variant="secondary">
            {t(`${translationPrefix}.download`)}
          </Button>
        </div>
      </Container>
    </section>
  );
};
