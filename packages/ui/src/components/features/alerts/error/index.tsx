import { memo, type FC } from "react";

import {
  Alert,
  AlertTitle,
  AlertDescription,
  Button,
} from "@/components";


import { cn } from "@/lib";

// todo: review
import { Icon } from "../../../primitives/icon";

interface ErrorAlertProps {
  message: string;
  actionMessage: string;
  title: string;
  onAction: () => void;
  className?: string;
}

export const ErrorAlert: FC<ErrorAlertProps> = memo(
  ({ message, title, actionMessage, onAction, className }) => {
    return (
      <Alert
        variant="destructive"
        className={cn(className, "mx-auto w-fit", "flex flex-col gap-4")}
      >
        <div className="flex items-center gap-2">
          <Icon name="AlertCircleIcon" className="h-4 w-4" />

          <AlertTitle className="m-0 text-lg">{title}</AlertTitle>
        </div>

        <AlertDescription>{message}</AlertDescription>

        <Button
          variant="button-white"
          className="h-8 py-0 text-sm font-semibold"
          onClick={onAction}
        >
          {actionMessage}
        </Button>
      </Alert>
    );
  }
);
