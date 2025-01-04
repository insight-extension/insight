import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib";

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

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
                "w-[100px]",
                "text-[10px] font-semibold",
                "border border-transparent bg-green-500 uppercase text-dark"
            )}
        >
            Coming Soon
        </Badge>
    );
};

export { Badge, UpcomingSoonBadge, badgeVariants };
