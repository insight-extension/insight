"use client";

import { useEffect, useState } from "react";
import i18next from "i18next";
import { useTranslation } from "next-i18next";
import { initReactI18next } from "react-i18next";
import { useCookies } from "react-cookie";
import resourcesToBackend from "i18next-resources-to-backend";
import LanguageDetector from "i18next-browser-languagedetector";

import { isServerSide } from "@repo/shared/utils";

import {
  getOptions,
  applicationLanguages,
  cookieName,
  Options,
  fallbackLanguage,
  defaultNameSpace,
} from "../settings";

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`../locales/${language}/${namespace}.json`)
    )
  )
  .init({
    ...getOptions(),
    lng: undefined, // let detect the language on client side
    detection: {
      order: ["path", "htmlTag", "cookie", "navigator"],
    },
    preload: isServerSide ? applicationLanguages : false,
    interpolation: {
      escapeValue: false,
    },
  });

export function useTranslationClient(
  language = fallbackLanguage,
  nameSpace = defaultNameSpace,
  options?: Options
) {
  const [cookies, setCookie] = useCookies([cookieName]);
  const translationResponse = useTranslation(nameSpace, options);
  const { i18n } = translationResponse;

  const [activeLanguage, setActiveLanguage] = useState(i18n.resolvedLanguage);

  useEffect(() => {
    if (activeLanguage === i18n.resolvedLanguage) {
      return;
    }

    setActiveLanguage(i18n.resolvedLanguage);
  }, [activeLanguage, i18n.resolvedLanguage]);

  useEffect(() => {
    if (!language || i18n.resolvedLanguage === language) {
      return;
    }

    i18n.changeLanguage(language);
  }, [language, i18n]);

  useEffect(() => {
    if (cookies.i18next === language) {
      return;
    }

    setCookie(cookieName, language, { path: "/" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, cookies.i18next]);

  return translationResponse;
}
