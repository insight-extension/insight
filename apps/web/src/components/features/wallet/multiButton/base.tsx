import type { WalletName } from "@solana/wallet-adapter-base";
import { WalletIcon } from "@solana/wallet-adapter-react-ui";
import type {
    CSSProperties,
    FC,
    MouseEvent,
    PropsWithChildren,
    ReactElement,
} from "react";

import { cn } from "@/lib";

interface BaseWalletConnectionButtonProps extends PropsWithChildren {
    className?: string;
    disabled?: boolean;
    endIcon?: ReactElement;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    style?: CSSProperties;
    tabIndex?: number;
    walletIcon?: string;
    walletName?: WalletName;
    isHighlighted?: boolean;
}

export const BaseWalletConnectionButton: FC<
    BaseWalletConnectionButtonProps
> = ({
    className,
    children,
    endIcon,
    walletIcon,
    walletName,
    isHighlighted,
    ...props
}) => {
    const highlightVariant = isHighlighted ? "shadow-md shadow-green-300" : "";
    return (
        <button
            className={cn(highlightVariant, className)}
            {...props}
            type="button"
        >
            <div className="flex items-center gap-2 text-sm">
                {walletIcon && walletName && (
                    <i className="wallet-adapter-button-start-icon">
                        <WalletIcon
                            wallet={{
                                adapter: { icon: walletIcon, name: walletName },
                            }}
                        />
                    </i>
                )}

                <p>{children}</p>
            </div>
        </button>
    );
};
