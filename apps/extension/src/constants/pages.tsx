import BellIcon from "react:@/assets/bell.svg";
import CreditCardIcon from "react:@/assets/credit-card-refresh.svg";
import GlobeIcon from "react:@/assets/globe.svg";
import HomeIcon from "react:@/assets/home-line.svg";
import MessageIcon from "react:@/assets/message-dots-square.svg";
import SettingsIcon from "react:@/assets/settings-02.svg";
import TranslateIcon from "react:@/assets/translate-02.svg";

export type PageValues = "home" | "creditCard" | "translate" | "settings";

export const pages: { label: string; value: PageValues; icon: any }[] = [
  {
    label: "Home",
    value: "home",
    icon: HomeIcon
  },
  {
    label: "CreditCard",
    value: "creditCard",
    icon: CreditCardIcon
  },
  {
    label: "Translate",
    value: "translate",
    icon: TranslateIcon
  },
  {
    label: "Settings",
    value: "settings",
    icon: SettingsIcon
  }
];

export type SettingPageValues =
  | "main"
  | "support"
  | "notifications"
  | "language";

export const settingPages: {
  label: string;
  value: SettingPageValues;
  icon: any;
}[] = [
  {
    label: "Support",
    value: "support",
    icon: MessageIcon
  },
  {
    label: "Notifications",
    value: "notifications",
    icon: BellIcon
  },
  {
    label: "Language",
    value: "language",
    icon: GlobeIcon
  }
];
