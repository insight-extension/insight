import { match } from "ts-pattern";

import { cn } from "@repo/ui/lib";

import { ConnectionStatus as ConnectionStatusType } from "@/constants";

interface ConnectionStatusProps {
  status: ConnectionStatusType;
}
export const ConnectionStatus = (props: ConnectionStatusProps) => {
  const { status } = props;

  return (
    <div className="flex justify-center items-center p-2 gap-2 bg-white dark:bg-dark-100 rounded-[17px]">
      <div
        className={cn(
          "!w-[14px] relative !h-[14px] flex justify-center items-center rounded-full bg-gradient-to-r ",
          match(status)
            .with(
              ConnectionStatusType.CONNECTED,
              () =>
                "from-blue-400/30 dark:from-blue-500/30 dark:to-blue-200/30 to-green-300/30"
            )
            .with(
              ConnectionStatusType.CONNECTING,
              () =>
                "from-yellow-400/30 dark:from-yellow-500/30 dark:to-yellow-200/30 to-yellow-300/30"
            )
            .with(
              ConnectionStatusType.DISCONNECTED,
              () =>
                "from-red-400/30 dark:from-red-500/30 dark:to-red-200/30 to-red-300/30"
            )
            .exhaustive()
        )}
      >
        <div
          className={cn(
            "!w-[7px] absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 !h-[7px] rounded-full bg-gradient-to-r",
            match(status)
              .with(
                ConnectionStatusType.CONNECTED,
                () =>
                  "from-blue-400 dark:from-blue-500 dark:to-blue-200 to-green-300"
              )
              .with(
                ConnectionStatusType.CONNECTING,
                () =>
                  "from-yellow-400 dark:from-yellow-500 dark:to-yellow-200 to-yellow-300"
              )
              .with(
                ConnectionStatusType.DISCONNECTED,
                () =>
                  "from-red-400 dark:from-red-500 dark:to-red-200 to-red-300"
              )
              .exhaustive()
          )}
        />
      </div>
      <div
        className={cn(
          "text-sm text-blue-300",
          match(status)
            .with(ConnectionStatusType.CONNECTED, () => "text-blue-300")
            .with(ConnectionStatusType.CONNECTING, () => "text-yellow-500")
            .with(ConnectionStatusType.DISCONNECTED, () => "text-red-400")
            .exhaustive()
        )}
      >
        {status}
      </div>
    </div>
  );
};
