export const cookieName = "i18next";

export const defaultNameSpace = "translation";

export const fallbackLanguage = "en";
export const applicationLanguages = [fallbackLanguage, "ua", "fr"];

export interface Options {
  keyPrefix?: any;
}

export function getOptions(
  language = fallbackLanguage,
  nameSpace = defaultNameSpace
) {
  return {
    supportedLngs: applicationLanguages,
    fallbackLng: fallbackLanguage,
    lng: language,
    fallbackNS: defaultNameSpace,
    defaultNS: defaultNameSpace,
    ns: nameSpace,
  };
}
