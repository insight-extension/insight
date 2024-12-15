import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

// todo: move to one place
import { Circle } from "lucide-react";

import { cn } from "@/lib/cn";

const RadioGroup = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
    return (
        <RadioGroupPrimitive.Root
            className={cn("grid gap-2", className)}
            {...props}
            ref={ref}
        />
    );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
        color: "green";
    }
>(({ className, color, ...props }, ref) => {
    //todo: MOVE TO VARIANTS
    const colorVariants = {
        green: {
            icon: "fill-green-300",
            border: "border-green-300",
        },
    };
    return (
        <RadioGroupPrimitive.Item
            ref={ref}
            className={cn(
                colorVariants[color].border,
                "aspect-square h-4 w-4 rounded-full border ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        >
            <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                <Circle
                    className={cn(
                        colorVariants[color].icon,
                        "w-2.50 h-2.5 text-current"
                    )}
                />
            </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
    );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
