import React from "react";

import { Heading2, Container } from "@repo/ui/components";

import { useTranslationClient } from "@repo/i18n";

interface FeaturesProps {
  translationPrefix?: string;
}

export const Features = ({ translationPrefix = "features" }: FeaturesProps) => {
  const { t } = useTranslationClient();

  return (
    <section className="py-10" id="features">
      <Container>
        <Heading2 className="leading-[3rem] mb-2">
          {t(`${translationPrefix}.title`)}
        </Heading2>

        <div className="grid grid-rows-2 grid-cols-2 gap-10">
          {(
            t(`${translationPrefix}.features`, {
              returnObjects: true,
            }) as { title: string; description: string }[]
          ).map((feature, index) => (
            <div
              key={feature.title}
              className="bg-accent p-7 rounded-lg w-full"
            >
              <p className="text-primary-foreground py-1 px-2.5 rounded-xl capitalize text-xl">
                {feature.title}
              </p>

              <p className="text-primary-foreground py-1 px-2.5 rounded-xl capitalize">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
