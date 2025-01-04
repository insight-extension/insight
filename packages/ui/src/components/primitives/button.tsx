import { type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: "button-white" | "button-dark-border" | "button-dark";
  children: React.ReactNode;
}

export const Button = ({
  children,
  variant,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button className={cn("button", variant, className)} {...props}>
      {children}
    </button>
  );
};
