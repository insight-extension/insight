import { useState } from "react";
import ArrowIcon from "react:@/assets/arrow.svg";
import SearchIcon from "react:@/assets/search-lg.svg";
import SwitchVerticalIcon from "react:@/assets/switch-vertical.svg";

import { Language } from "@/types";

interface Translations {
  id: number;
  targetLanguage: Language;
  sourceLanguage: Language;
  transcription: string;
  translation: string;
}
const mockTranslations: Translations[] = [
  {
    id: 1,
    targetLanguage: {
      name: "English",
      alpha2: "en",
      countryCode: "US"
    },
    sourceLanguage: {
      name: "Spanish",
      alpha2: "es",
      countryCode: "ES"
    },
    transcription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
    translation:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "
  },
  {
    id: 2,
    targetLanguage: {
      name: "English",
      alpha2: "en",
      countryCode: "US"
    },
    sourceLanguage: {
      name: "Spanish",
      alpha2: "es",
      countryCode: "ES"
    },
    transcription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
    translation:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "
  },
  {
    id: 3,
    targetLanguage: {
      name: "English",
      alpha2: "en",
      countryCode: "US"
    },
    sourceLanguage: {
      name: "Spanish",
      alpha2: "es",
      countryCode: "ES"
    },
    transcription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
    translation:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "
  }
];
export const TranslationsPage = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col gap-3 px-3 overflow-hidden">
      <div className="text-sm text-dark-200 font-medium dark:text-white-100">
        Translation History
      </div>
      <div className="relative text-grey-600">
        <input
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Search"
          className=" py-2 text-xs pl-[22px] pr-1 w-full rounded-[20px] border dark:border-grey-500 border-grey-300 bg-transparent"
        />
        <SearchIcon className="absolute left-[8px] top-1/2 h-3 w-3 -translate-y-1/2" />
      </div>
      <div className="overflow-y-auto flex flex-col gap-2">
        {mockTranslations
          .filter(
            (translations) =>
              translations.translation
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              translations.transcription
                .toLowerCase()
                .includes(search.toLowerCase())
          )
          .map((translation) => (
            <div className="relative flex flex-col gap-1 flex-1">
              <div className="flex-1 flex flex-col gap-2 pt-2 px-3 pb-4 bg-blue-100 rounded-[17px] dark:bg-blue-600">
                <div className="flex items-center gap-2 text-dark-200/60 dark:text-white-100/70 text-[10px]">
                  {translation.sourceLanguage.name}
                  <ArrowIcon className="w-3" />
                  {translation.targetLanguage.name}
                </div>
                <div className="dark:text-white-100/90 text-sm text-dark-200">
                  {translation.transcription}
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2 pt-2 px-3 pb-4 bg-blue-100 rounded-[17px] dark:bg-blue-600">
                <div className="flex items-center gap-2 text-dark-200/60 dark:text-white-100/70 text-[10px]">
                  {translation.sourceLanguage.name}
                  <ArrowIcon className="w-3" />
                  {translation.targetLanguage.name}
                </div>
                <div className="dark:text-white-100/90 text-sm text-dark-200">
                  {translation.translation}
                </div>
              </div>
              <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[30px] h-[30px] flex justify-center items-center bg-white dark:bg-dark-100 rounded-full">
                <SwitchVerticalIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};
