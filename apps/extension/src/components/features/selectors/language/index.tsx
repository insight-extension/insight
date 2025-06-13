import React, { useEffect, useRef, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import SearchIcon from "react:@/assets/search-lg.svg";

import { useOnClickOutside } from "usehooks-ts";

import { cn } from "@repo/ui/lib";

import { TRANSLATION_LANGUAGES } from "@/constants";
import { Language } from "@/types";

interface LanguageSelectorProps {
  current: Language | null;
  onChange: (language: Language) => void;
  exclude: Language;
  disabled: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  current,
  onChange,
  exclude,
  disabled
}) => {
  const { getMessage } = chrome.i18n;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");

  const ref = useRef(null);

  const handleClickOutside = () => {
    setIsDropdownOpen(false);
  };
  useOnClickOutside(ref, handleClickOutside);

  useEffect(() => {
    setSearch("");
  }, [isDropdownOpen]);

  return (
    <>
      <div
        className={cn(
          "relative bg-white dark:bg-dark-100 rounded-[17px] px-1 border-grey-300 dark:border-grey-500 border",
          isDropdownOpen && "rounded-b-none bg-gray-100 dark:bg-dark-300"
        )}
        ref={ref}
      >
        <button
          className={cn(
            "flex text-sm justify-between w-full items-center p-[6px] text-dark-200 dark:text-white-100 disabled:opacity-70 disabled:cursor-not-allowed",
            isDropdownOpen && ""
          )}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          disabled={disabled}
        >
          <div className="flex flex-row w-full items-end gap-1">
            {current ? (
              <>
                <div className="flex flex-row w-full items-center gap-2 rounded-xl">
                  <div className="overflow-hidden rounded-full aspect-square flex justify-center items-center">
                    <ReactCountryFlag
                      countryCode={current.countryCode}
                      svg
                      cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                      cdnSuffix="svg"
                      title={current.name}
                      className="cursor-pointer overflow-hidden"
                      style={{ width: "12px", height: "12px" }}
                    />
                  </div>
                  <span className="text-sm">{current.name}</span>
                </div>
              </>
            ) : (
              <span className="text-sm">{getMessage("selectLanguage")}</span>
            )}
          </div>
        </button>
        {isDropdownOpen && (
          <div className="absolute z-50  bg-gray-100 dark:bg-dark-300 w-[calc(100%+2px)] rounded-b-[17px] pb-1 pt-[1px] bottom-[1px] -left-[1px] translate-y-full flex flex-col gap-1 border-grey-300 dark:border-grey-500 border border-t-0">
            <div className="relative px-2 text-grey-600">
              <input
                type="text"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                placeholder="Search"
                className=" py-2 text-xs pl-[22px] pr-1 w-full rounded-[20px] border dark:border-grey-500 border-white bg-transparent"
              />
              <SearchIcon className="absolute left-[14px] top-1/2 h-3 w-3 -translate-y-1/2" />
            </div>
            <div className="max-h-[150px] overflow-auto w-full">
              {TRANSLATION_LANGUAGES.filter((item) => {
                return (
                  item.name.toLowerCase().includes(search.toLowerCase()) ||
                  item.alpha2.toLowerCase().includes(search.toLowerCase())
                );
              }).map(({ alpha2, name: language, countryCode }) => (
                <button
                  disabled={
                    alpha2 === current?.alpha2 || alpha2 === exclude.alpha2
                  }
                  key={alpha2}
                  className={cn(
                    "flex w-full gap-1 px-2 py-1 text-dark-200 dark:text-white-100 items-center hover:bg-blue-300 hover:bg-opacity-45",
                    alpha2 === current?.alpha2 ||
                      (alpha2 === exclude.alpha2 && "cursor-not-allowed")
                  )}
                  onClick={() => {
                    onChange({ alpha2, name: language, countryCode });
                    setSearch("");
                    setIsDropdownOpen(false);
                  }}
                >
                  <div className="overflow-hidden rounded-full aspect-square flex justify-center items-center">
                    <ReactCountryFlag
                      countryCode={countryCode}
                      svg
                      cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                      cdnSuffix="svg"
                      title={language}
                      className="cursor-pointer overflow-hidden"
                      style={{ width: "12px", height: "12px" }}
                    />
                  </div>
                  {language}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
