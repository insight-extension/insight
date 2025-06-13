import ArrowContinueIcon from "react:@/assets/arrow-continue.svg";

import { SettingPageValues, settingPages } from "@/constants/pages";

interface SettingsPageProps {
  setCurrentPage: (page: SettingPageValues) => void;
}
export const SettingsPage = (props: SettingsPageProps) => {
  const { setCurrentPage } = props;

  return (
    <>
      <div className="text-sm text-dark-200 font-medium dark:text-white-100">
        Settings
      </div>
      <div className="overflow-y-auto flex flex-col gap-2">
        {settingPages.map((page) => (
          <button
            className="flex justify-between items-center p-3 bg-grey-200 dark:bg-dark-300 rounded-full disabled:opacity-60 disabled:cursor-not-allowed"
            key={page.value}
            onClick={() => setCurrentPage(page.value)}
            disabled={page.disabled}
          >
            <div className="flex gap-1.5 items-center">
              <page.icon className="h-4 w-4" />
              <div className="text-sm text-dark-200 dark:text-white-100">
                {page.label}
              </div>
            </div>
            <ArrowContinueIcon className="h-4 w-4 text-dark-200 dark:text-white-100" />
          </button>
        ))}
      </div>
    </>
  );
};
