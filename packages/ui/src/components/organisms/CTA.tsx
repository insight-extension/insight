import React from "react";
import Image from "next/image";

import { Container, Button } from "@repo/ui/components";
import { useTranslationClient } from "@repo/i18n";
import { CTA as CTABanner } from "@repo/ui/assets";

interface CTAProps {
  translationPrefix?: string;
}

export const CTA = ({ translationPrefix = "cta" }: CTAProps) => {
  const { t } = useTranslationClient();

  return (
    <section className="py-20">
      <Container className="relative">
        <Button
          className="w-52 h-12 absolute bottom-12 left-1/2 transform -translate-x-1/2 "
          size="lg"
          variant="secondary"
        >
          {t(`${translationPrefix}.download`)}
        </Button>

        <Image width={1200} height={400} src={CTABanner} alt="cta" />
      </Container>
    </section>
  );
};
