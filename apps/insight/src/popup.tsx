import { ChevronsUpDown, CircleX, Languages } from "lucide-react";
import { useState } from "react";
import ReactCountryFlag from "react-country-flag";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import { Button } from "~components/ui/button";
import { TextBlock } from "~components/ui/textBlock";
import { Connection, type Language } from "~types";

import "~global.css";

// todo: replace with real data
const getBalance = () => 100;
const getStatus = () => Connection.CONNECTED;
const isRecording = () => !true;
const supportedLanguages: Language[] = [
  {
    name: "English",
    flagCode: "us"
  },
  {
    name: "Українська",
    flagCode: "ua"
  },
  {
    name: "Français",
    flagCode: "fr"
  },
  {
    name: "English",
    flagCode: "us"
  },
  {
    name: "Українська",
    flagCode: "ua"
  },
  {
    name: "Français",
    flagCode: "fr"
  },
  {
    name: "English",
    flagCode: "us"
  },
  {
    name: "Українська",
    flagCode: "ua"
  },
  {
    name: "Français",
    flagCode: "fr"
  },
  {
    name: "English",
    flagCode: "us"
  },
  {
    name: "Українська",
    flagCode: "ua"
  },
  {
    name: "Français",
    flagCode: "fr"
  }
];

function IndexPopup() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    supportedLanguages[0]
  );
  const { getMessage } = chrome.i18n;

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
  };

  const closeExtension = () => window.close();

  return (
    <div className="w-84">
      <div className="p-3 mb-2 bg-accent rounded-b-2xl">
        <div className="flex flex-row items-center justify-between mb-3 p-0 text-primary-foreground">
          <p className="text-xl">{getMessage("extensionName")}</p>

          <Button
            size="icon"
            variant="raw"
            className="bg-transparent"
            onClick={closeExtension}>
            <CircleX
              size={24}
              className="text-primary-foreground hover:text-primary-foreground/80"
            />
          </Button>
        </div>

        <div className="flex flex-row justify-between items-center mb-3">
          <Button variant="default" className="w-38">
            {getMessage("connectWallet")}
          </Button>

          <Button variant="default" className="w-38">
            {getMessage("depositFunds")}
          </Button>
        </div>

        <div className="flex flex-row justify-between items-center mb-2">
          <div className="flex flex-row items-center h-8 w-38 bg-accent-foreground rounded">
            <p className="px-3 text-primary-foreground font-medium text-">
              {`${getMessage("balance")}: ${getBalance()}`}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex flex-row justify-between items-center h-8 w-38 gap-2 text-primary bg-secondary px-3 rounded">
              <Languages size={16} />

              <div className="flex flex-row items-center gap-2">
                <span className="text-sm">{currentLanguage.name}</span>

                <ChevronsUpDown size={12} />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="max-h-40 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-500">
              {supportedLanguages.map(({ flagCode, name: language }) => (
                <DropdownMenuItem
                  key={flagCode}
                  className="cursor-pointer w-36"
                  onClick={() =>
                    handleLanguageChange({ flagCode, name: language })
                  }>
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
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="px-3 text-primary-foreground font-medium text-sm">
          {`${getMessage("status")}: `}
          <span
            className={
              getStatus() === Connection.CONNECTED
                ? "text-green-500"
                : getStatus() === Connection.CONNECTING
                  ? "text-yellow-500"
                  : "text-red-500"
            }>
            {getStatus()}
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-3 px-3 py-2">
        <TextBlock className="bg-muted max-h-40 text-primary rounded-lg text-sm" />

        <TextBlock className="bg-secondary-foreground max-h-44 text-primary rounded-lg text-sm" />

        <Button
          size="lg"
          className={`p-3 w-full ${isRecording() ? "bg-muted" : "bg-secondary"}`}>
          {isRecording() ? getMessage("stop") : getMessage("start")}
        </Button>
      </div>
    </div>
  );
}

export default IndexPopup;
