import React from "react";

import {
  Heading2,
  Container,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
  Accordion,
} from "@repo/ui/components";
import { useTranslationClient } from "@repo/i18n";

interface FAQProps {
  translationPrefix?: string;
}

export const FAQ = ({ translationPrefix = "faq" }: FAQProps) => {
  const { t } = useTranslationClient();

  return (
    <section className="py-40" id="faq">
      <Container>
        <Heading2 className="leading-[3rem] mb-16 text-center">
          {t(`${translationPrefix}.title`)}
        </Heading2>

        <Accordion type="single" collapsible>
          {(
            t(`${translationPrefix}.questions`, {
              returnObjects: true,
            }) as { title: string; answer: string }[]
          ).map((question, index) => (
            <AccordionItem value={question.title}>
              <AccordionTrigger className="text-primary-foreground font-medium text-lg">
                {`${index + 1}. ${question.title}`}
              </AccordionTrigger>

              <AccordionContent className="text-primary-foreground">
                {question.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
};
