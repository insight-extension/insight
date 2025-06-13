import { useCallback, useState } from "react";
import ArrowContinueIcon from "react:@/assets/arrow-continue.svg";
import BellIcon from "react:@/assets/bell.svg";
import GlobeIcon from "react:@/assets/globe.svg";
import MessageIcon from "react:@/assets/message-dots-square.svg";

import { LanguagesPage } from "@/components/pages/settings/Languages";
import { NotificationsPage } from "@/components/pages/settings/Notifications";
import { SettingsPage as SettingsSection } from "@/components/pages/settings/Settings";
import { SupportPage } from "@/components/pages/settings/Support";
import { SettingPageValues, settingPages } from "@/constants/pages";

export const SettingsPage = () => {
  const [currentPage, setCurrentPage] = useState<SettingPageValues>("main");

  const getCurrentPage = useCallback(() => {
    switch (currentPage) {
      case "main":
        return <SettingsSection setCurrentPage={setCurrentPage} />;
      case "support":
        return <SupportPage />;
      case "notifications":
        return (
          <NotificationsPage returnToMain={() => setCurrentPage("main")} />
        );
      case "language":
        return <LanguagesPage returnToMain={() => setCurrentPage("main")} />;
    }
  }, [currentPage]);

  return (
    <div className="flex flex-col gap-3 px-2 overflow-hidden">
      {getCurrentPage()}
    </div>
  );
};
