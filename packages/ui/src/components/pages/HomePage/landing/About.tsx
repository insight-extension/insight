import React from "react";

import Container from "@repo/ui/components/atoms/container";
import { Heading2 } from "@repo/ui/components/atoms/heading";
import { useTranslationClient } from "@repo/i18n";

interface AboutProps {
  translationPrefix?: string;
}

export const About = ({ translationPrefix = "about" }: AboutProps) => {
  const { t } = useTranslationClient();

  return (
    <section className="py-10">
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