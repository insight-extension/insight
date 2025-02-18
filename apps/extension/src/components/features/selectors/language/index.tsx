import React from "react";
import ReactCountryFlag from "react-country-flag";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui";
import { SUPPORTED_LANGUAGES } from "@/constants";
import { Language } from "@/types";

interface LanguageSelectorProps {
  current: Language;
  onChange: (language: Language) => void;
  label: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  current,
  onChange,
  label
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex flex-row justify-between items-center h-8 w-38 gap-2 text-primary px-2 bg-white rounded">
        <div className="flex flex-row items-end gap-1">
          <span className="text-sm">{label}:</span>

          <div className="flex flex-row items-center gap-1">
            <ReactCountryFlag
              countryCode={current.flagCode}
              svg
              cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
              cdnSuffix="svg"
              title={current.name}
              style={{ cursor: "pointer" }}
            />

            <span className="text-sm">{current.name}</span>
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="max-h-40 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-muted [&::-webkit-scrollbar-thumb]:bg-gray-300">
        {Object.values(SUPPORTED_LANGUAGES).map(
          ({ flagCode, name: language }) => (
            <DropdownMenuItem
              disabled
              key={flagCode}
              className="cursor-pointer w-36"
              onClick={() => onChange({ flagCode, name: language })}
            >
              <ReactCountryFlag
                countryCode={flagCode}
                svg
                cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                cdnSuffix="svg"
                title={language}
                style={{ cursor: "pointer" }}
                className="mr-2"
              />
              {language}
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
