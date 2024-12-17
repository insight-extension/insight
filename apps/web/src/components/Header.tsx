import { FC } from "react";

import { Logo } from "./Logo";
import { Button } from "./Button";
import GlobalIcon from "../assets/icons/Global.svg";

import { NAV_LINKS } from "@/configs";
import { UpcomingSoonBadge, WalletMultiButton } from "@/components";
import { cn } from "@/lib";

export interface HeaderProps {
    className?: string;
}

export const Header: FC<HeaderProps> = ({ className }) => {
    return (
        <nav
            className={cn(
                "container mt-6 items-center justify-between",
                className
            )}
        >
            <div className="flex items-center">
                <Logo />

                <ul className="ml-[113px] flex gap-7">
                    {NAV_LINKS.map((link, index) => (
                        <li key={index}>
                            <a href={link.url}>{link.title}</a>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex items-center">
                <div className="flex gap-1">
                    <div className="relative">
                        <UpcomingSoonBadge className="-top-2 right-0" />

                        <Button
                            disabled
                            variant="button-white"
                            className="h-10 cursor-progress py-2 text-[1rem]"
                        >
                            Download Now
                        </Button>
                    </div>

                    <WalletMultiButton
                        className={cn("button button-dark-border", "h-10 py-2")}
                    />
                </div>

                <div className="relative">
                    <UpcomingSoonBadge className="-top-2 left-2" />

                    <div className="ml-2 grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full bg-white">
                        <img
                            src={GlobalIcon}
                            alt="GlobalIcon"
                            className="h-[22px] w-[22px]"
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
