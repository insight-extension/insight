import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib";

const badgeVariants = cva("", {
    variants: {
        variant: {
            default: "badge",
            secondary: "badge badge-primary",
            destructive: "badge badge-secondary",
            outline: "badge-neutral",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

const Badge = ({ className, variant, ...props }: BadgeProps) => {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
};

const UpcomingSoonBadge = ({ className }: BadgeProps) => {
    return (
        <Badge
            className={cn(
                className,
                "absolute",
                "w-[90px] px-0",
                "text-[10px] font-semibold",
                "border border-transparent bg-green-500 uppercase text-dark"
            )}
        >
            Coming Soon
        </Badge>
    );
};

export { Badge, UpcomingSoonBadge, badgeVariants };
