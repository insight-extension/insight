import { useState } from "react";
import ArrowContinueIcon from "react:@/assets/arrow-continue.svg";

interface NotificationItem {
  id: number;
  heading: string;
  description: string;
}

interface NotificationsPageProps {
  returnToMain: () => void;
}
export const NotificationsPage = (props: NotificationsPageProps) => {
  const { returnToMain } = props;

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  return (
    <>
      <button
        className="text-sm text-dark-200 font-medium dark:text-white-100 flex items-center gap-2"
        onClick={returnToMain}
      >
        <ArrowContinueIcon className="h-4 w-4 rotate-180" />
        Notifications
      </button>
      <div className="overflow-y-auto flex flex-col gap-2">
        {notifications.length === 0 && (
          <div className="text-sm text-dark-200 font-medium dark:text-white-100">
            No notifications found
          </div>
        )}
        {notifications.map((notification) => (
          <div className="flex flex-col gap-1 flex-1 p-3 bg-grey-300/45 dark:bg-dark-300 rounded-[17px]">
            <div className="flex-1 flex flex-col gap-2 dark:bg-blue-600 text-xs text-dark-200 dark:text-white-100">
              <div className="font-medium">{notification.heading}</div>
              <div>{notification.description}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
