import { useState } from "react";
import InfoCircleIcon from "react:@/assets/info-circle.svg";
import CloseIcon from "react:@/assets/x-close.svg";

import { cn } from "@repo/ui/lib";

interface InfoBlockProps {
  title: string;
  blockInfo: {
    title: string;
    description?: string;
    onClick?: () => void;
    disabled?: boolean;
  }[];
}

export const InfoBlock = (props: InfoBlockProps) => {
  const { title, blockInfo } = props;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div
      className={cn(
        "relative bg-white dark:bg-dark-100 rounded-[17px] p-1",
        isDropdownOpen && blockInfo.length > 1 && "rounded-b-none"
      )}
    >
      <div className="flex justify-between items-center p-[6px] text-dark-200 dark:text-white-100">
        <div className="text-sm">{title}</div>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-5 h-5"
        >
          {isDropdownOpen ? (
            <CloseIcon className="w-full h-full" />
          ) : (
            <InfoCircleIcon className="w-full h-full" />
          )}
        </button>
      </div>
      <div className="flex flex-col gap-1">
        {blockInfo.slice(0, 1).map((info) => (
          <div
            key={info.title}
            className="flex flex-col gap-1 px-[10px] py-2 text-dark-200 dark:text-white-100 rounded-[11px] bg-blue-100 dark:bg-dark-300"
          >
            <div
              className={cn(
                "text-[11px] text-grey-400 dark:text-white-100/80",
                !info.description && "leading-[36.5px]"
              )}
            >
              {info.title}
            </div>
            {info.description && (
              <div className="text-xs font-medium text-dark-200 dark:text-white-100">
                {info.description}
              </div>
            )}
          </div>
        ))}
      </div>
      {isDropdownOpen && blockInfo.length > 1 && (
        <div className="absolute z-50 bg-white dark:bg-dark-100 w-full px-1 rounded-b-[17px] pb-1 pt-[1px] bottom-[1px] left-0 translate-y-full flex flex-col gap-1">
          {blockInfo.slice(1, blockInfo.length).map((info) => (
            <div
              key={info.title}
              className={cn(
                "flex flex-col gap-1 px-[10px] py-2 text-dark-200 dark:text-white-100 rounded-[11px] bg-blue-100 dark:bg-dark-300",
                info.disabled && "cursor-not-allowed",
                info.onClick && "cursor-pointer"
              )}
              onClick={info.disabled ? undefined : info.onClick}
            >
              <div className="text-[11px] text-grey-400 dark:text-white-100/80">
                {info.title}
              </div>
              <div className="text-xs font-medium text-dark-200 dark:text-white-100">
                {info.description}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
