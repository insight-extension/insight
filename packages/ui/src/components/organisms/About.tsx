import React from "react";

import { useTranslationClient } from "@repo/i18n";
import { Heading2, Container } from "@repo/ui/components";

interface AboutProps {
  translationPrefix?: string;
}

export const About = ({ translationPrefix = "about" }: AboutProps) => {
  const { t } = useTranslationClient();

  return (
    <section className="py-40" id="about">
      <Container>
        <Heading2 className="leading-[3rem] mb-16 text-center">
          {t(`${translationPrefix}.title`)}
        </Heading2>

        <div className="grid grid-rows-2 grid-cols-2 gap-10">
          {(
            t(`${translationPrefix}.stepsContent`, {
              returnObjects: true,
            }) as string[]
          ).map((step, index) => (
            <div
              key={step}
              className={`py-6 px-8 border-double border-8 border-primary bg-accent p-5 text-primary-foreground rounded-3xl w-full ${index === 2 ? "col-span-2" : "col-span-1"}`}
            >
              <h5 className="rounded-xl capitalize text-3xl font-medium mb-1">
                {t(`${translationPrefix}.step`)} {index + 1}
              </h5>

              <p className="rounded-xl capitalize text-lg">{step}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
