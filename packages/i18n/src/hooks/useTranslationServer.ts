import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";

import {
  Options,
  defaultNameSpace,
  fallbackLanguage,
  getOptions,
} from "../settings";

const initializeI18n = async (language: string, nameSpace: string) => {
  const i18nInstance = createInstance();

  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (_language: string, namespace: string) =>
          import(`../locales/${_language}/${namespace}.json`)
      )
    )
    .init(getOptions(language, nameSpace));

  return i18nInstance;
};

export async function useTranslationServer(
  language = fallbackLanguage,
  nameSpace = defaultNameSpace,
  options: Options = {}
): Promise<any> {
  const i18nextInstance = await initializeI18n(language, nameSpace);

  return {
    t: i18nextInstance.getFixedT(
      language,
      Array.isArray(nameSpace) ? nameSpace[0] : nameSpace,
      options.keyPrefix
    ),
    i18n: i18nextInstance,
  };
}
