import { useTranslationServer } from "@repo/i18n";
import Link from "next/link";

export const SSRPage = async ({
  params: { language },
}: {
  params: { language: string };
}) => {
  const { t } = await useTranslationServer(language);

  return (
    <>
      <h1>CURRENT: {language}</h1>
      <h2>{t("home.clickerButton")}</h2>

      <Link href={`/${language}/second-page`}>{t("to-second-page")}</Link>
    </>
  );
};
