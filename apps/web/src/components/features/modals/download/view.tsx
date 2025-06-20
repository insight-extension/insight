import { useIntl } from "react-intl";

import { Icon, IconName } from "@repo/ui/components";

import { DOWNLOAD_EXTENSION_URL, INSTALLATION_INSTRUCTION_URL } from "@/config";
import { cn } from "@/lib";

interface DownloadModalViewProps {
  namespace: string;
}

export const DownloadModalView: React.FC<DownloadModalViewProps> = ({
  namespace
}) => {
  const intl = useIntl();

  return (
    <div className="mt-10 flex flex-col gap-2">
      {[
        {
          href: DOWNLOAD_EXTENSION_URL,
          messageId: `${namespace}.link`,
          icon: "Download" as IconName
        },
        {
          href: INSTALLATION_INSTRUCTION_URL,
          messageId: `${namespace}.instruction.link`,
          icon: "ListCollapse" as IconName
        }
      ].map(({ href, messageId, icon }) => (
        <div
          key={href}
          className="flex w-full items-center gap-2 rounded-md bg-white px-4 py-2"
        >
          <Icon name={icon} color="#333" />

          <a
            target="_blank"
            rel="noreferrer"
            href={href}
            className={cn(
              "text-dark w-full cursor-pointer text-center text-lg font-medium underline"
            )}
          >
            {intl.formatMessage({ id: messageId })}
          </a>
        </div>
      ))}
    </div>
  );
};
