import { FC } from "react";

import { match } from "ts-pattern";

import { Icon } from "@repo/ui/components";

import { cn } from "@/lib";

interface LoaderProps {
  className?: string;
  withContainer?: boolean;
}

export const Loader: FC<LoaderProps> = ({ className, withContainer }) => {
  const Component = () => (
    <Icon name="Loader" className={cn("animate-spin", className)} />
  );

  return (
    <div>
      {match(withContainer)
        .with(true, () => (
          <div
            className={cn(
              "h-screen w-screen",
              "flex items-center justify-center"
            )}>
            <Component />
          </div>
        ))
        .otherwise(() => (
          <Component />
        ))}
    </div>
  );
};
