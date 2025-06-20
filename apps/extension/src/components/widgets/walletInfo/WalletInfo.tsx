import { useState } from "react";
import ArrowsIcon from "react:@/assets/arrows.svg";
import PlusIcon from "react:@/assets/plus.svg";
import WalletIcon from "react:@/assets/wallet-01.svg";

import debounce from "debounce";

import { formatPublicKey } from "@repo/shared/utils";

import { UI_URL } from "@/constants";
import { constructURLWithParams } from "@/utils";

interface WalletInfoProps {
  publicKey: string | null;
  accessToken: string | null;
}
export const WalletInfo = (props: WalletInfoProps) => {
  const { publicKey, accessToken } = props;

  const [isCopied, setIsCopied] = useState<boolean>(false);

  const { getMessage } = chrome.i18n;

  if (!publicKey) {
    return (
      <a
        href={constructURLWithParams({
          url: UI_URL,
          params: {
            action: "connect-wallet"
          }
        })}
        target="_blank"
        rel="noopener noreferrer"
        className="flex justify-between items-center p-1 bg-white dark:bg-dark-100 rounded-[17px]"
      >
        <div className="w-[31px] h-[31px] flex justify-center items-center rounded-full bg-blue-300 text-white dark:text-dark-100">
          <WalletIcon className="w-[17px] h-[17px]" />
        </div>
        <div className="font-medium text-base dark:text-white-100 text-dark-200">
          {getMessage("connectWallet")}
        </div>
        <div className="pr-2">
          <ArrowsIcon className="text-blue-300 w-5" />
        </div>
      </a>
    );
  } else {
    return (
      <div className="flex justify-between items-stretch p-1 bg-white dark:bg-dark-100 rounded-[17px]">
        <button
          className="flex items-center gap-[6px]"
          onClick={async () => {
            await navigator.clipboard.writeText(publicKey);

            setIsCopied(true);

            debounce(() => setIsCopied(false), 400)();
          }}
        >
          <div className="w-[31px] h-[31px] flex justify-center items-center rounded-full text-white dark:text-dark-100">
            <WalletIcon className="w-[17px] h-[17px] text-blue-200 dark:text-blue-500" />
          </div>
          <div className="max-w-[130px] font-medium text-sm dark:text-white-100">
            {formatPublicKey(publicKey) +
              (isCopied ? ` ${getMessage("copied")}` : "")}
          </div>
        </button>
        <button disabled={!accessToken}>
          <a
            className="flex h-full items-center gap-3 p-[2px] bg-blue-300 text-white dark:text-dark-100 rounded-[20px] pr-[14px]"
            href={constructURLWithParams({
              url: UI_URL,
              params: {
                action: "deposit"
              }
            })}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="h-full aspect-square rounded-full flex justify-center items-center bg-white dark:bg-dark-100">
              <PlusIcon className="w-[14px] h-[14px] text-blue-300" />
            </div>
            <div className="text-sm pr-[14px]">
              {getMessage("depositFunds")}
            </div>
          </a>
        </button>
      </div>
    );
  }
};
