import React from "react";

import { Heading2, Container } from "@repo/ui/components";

import { useTranslationClient } from "@repo/i18n";

interface FeaturesProps {
  translationPrefix?: string;
}

export const Features = ({ translationPrefix = "features" }: FeaturesProps) => {
  const { t } = useTranslationClient();

  return (
    <section className="py-40" id="features">
      <Container>
        <Heading2 className="leading-[3rem] mb-16 text-center">
          {t(`${translationPrefix}.title`)}
        </Heading2>

        <div className="grid grid-rows-3 grid-cols-4 gap-10">
          {(
            t(`${translationPrefix}.features`, {
              returnObjects: true,
            }) as { title: string; description: string }[]
          ).map((feature, index) => (
            <div
              key={feature.title}
              className={`bg-secondary p-7 rounded-lg justify-self-center ${index === 2 ? "w-1/2" : "w-full"} text-primary ${index === 2 ? "col-span-4" : "col-span-2"}`}
            >
              <h5 className="py-1 px-2.5 rounded-xl capitalize text-2xl font-medium">
                {feature.title}
              </h5>

              <p className="py-1 px-2.5 rounded-xl capitalize text-md">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
