import { cn } from "@/lib";
import { FC } from "react";

import { Icon } from "@/components";

interface LoaderProps {
    className?: string;
}

export const Loader: FC<LoaderProps> = ({ className }) => {
    return <Icon name="loader" className={cn("animate-spin", className)} />;
};
