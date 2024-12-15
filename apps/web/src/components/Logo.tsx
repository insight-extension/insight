import InsightLogo from "../assets/icons/InsightLogo.svg";
import { cn } from "@/lib";

type LogoProps = {
    className?: string;
};

export const Logo = ({ className }: LogoProps) => {
    return (
        <img
            src={InsightLogo}
            alt="Insight"
            className={cn("h-auto w-[110px]", className)}
            loading="eager"
        />
    );
};
