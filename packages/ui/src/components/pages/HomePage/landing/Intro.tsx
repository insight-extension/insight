import React from "react";

import { useTranslationClient } from "@repo/i18n";
import Container from "@repo/ui/components/atoms/container";
import { Heading2 } from "@repo/ui/components/atoms/heading";

interface IntroProps {
  translationPrefix?: string;
}

export const Intro = ({ translationPrefix = "intro" }: IntroProps) => {
  const { t } = useTranslationClient();

  return (
    <section className="py-10">
      <Container>
        <Heading2 className="leading-[3rem] mb-2">
          {t(`${translationPrefix}.title`)}
        </Heading2>

        <div className="grid grid-rows-2 grid-cols-2 gap-10">
          {(
            t(`${translationPrefix}.stepsContent`, {
              returnObjects: true,
            }) as string[]
          ).map((step, index) => (
            <div key={step} className="bg-accent p-7 rounded-lg w-full">
              <p className="text-primary-foreground py-1 px-2.5 rounded-xl capitalize text-xl">
                {t(`${translationPrefix}.step`)} {index + 1}
              </p>

              <p className="text-primary-foreground py-1 px-2.5 rounded-xl capitalize">
                {step}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
