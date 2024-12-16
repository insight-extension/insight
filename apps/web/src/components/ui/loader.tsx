import { cn } from "@/lib";
import { LoaderIcon } from "lucide-react";
import { FC } from "react";

interface LoaderProps {
    className?: string;
}

export const Loader: FC<LoaderProps> = ({ className }) => {
    return <LoaderIcon className={cn("animate-spin", className)} />;
};
