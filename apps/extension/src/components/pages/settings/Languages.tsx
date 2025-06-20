import { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import ArrowContinueIcon from "react:@/assets/arrow-continue.svg";
import CheckIcon from "react:@/assets/check.svg";

import { Language } from "@/types";

const availableLanguages: (Language & { disabled: boolean })[] = [
  { name: "English", alpha2: "en", countryCode: "US", disabled: false },
  { name: "Ukrainian", alpha2: "uk", countryCode: "UA", disabled: true },
  { name: "Swedish", alpha2: "sv", countryCode: "SE", disabled: true },
  { name: "Turkish", alpha2: "tr", countryCode: "TR", disabled: true },
  { name: "Spanish", alpha2: "es", countryCode: "ES", disabled: true }
];

interface LanguagesPageProps {
  returnToMain: () => void;
}
export const LanguagesPage = (props: LanguagesPageProps) => {
  const { returnToMain } = props;

  const [currentLanguage, setCurrentLanguage] = useState(availableLanguages[0]);

  const handleChangeLanguage = (
    newLanguage: Language & { disabled: boolean }
  ) => {
    setCurrentLanguage(newLanguage);
  };

  return (
    <>
      <button
        className="text-sm text-dark-200 font-medium dark:text-white-100 flex items-center gap-2"
        onClick={returnToMain}
      >
        <ArrowContinueIcon className="h-4 w-4 rotate-180" />
        Languages
      </button>
      <div className="overflow-y-auto flex flex-col gap-2">
        {availableLanguages.map((language, index) => (
          <button
            className="flex flex-row justify-between w-full items-center rounded-full bg-grey-200 dark:bg-dark-300 p-3 disabled:opacity-60 disabled:cursor-not-allowed"
            key={index}
            onClick={() => handleChangeLanguage(language)}
            disabled={language.disabled}
          >
            <div className="flex items-center gap-2">
              <div className="overflow-hidden rounded-full aspect-square flex justify-center items-center">
                <ReactCountryFlag
                  countryCode={language.countryCode}
                  svg
                  cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                  cdnSuffix="svg"
                  title={language.name}
                  className="cursor-pointer overflow-hidden"
                  style={{ width: "12px", height: "12px" }}
                />
              </div>
              <span className="text-sm font-medium text-dark-200 dark:text-white-100">
                {language.name}
              </span>
            </div>
            {language.alpha2 === currentLanguage.alpha2 ? (
              <div className="flex justify-center items-center h-3 w-3 p-[2px] bg-gradient-to-r rounded-[2px] from-blue-500 to-blue-200 text-white dark:text-dark-300">
                <CheckIcon className="h-full w-full" />
              </div>
            ) : null}
          </button>
        ))}
      </div>
    </>
  );
};
