import { cn } from "@repo/ui/utils";
import React, { type ReactNode } from "react";

interface ContainerProps {}

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return <h4 className={cn("px-60", className)}>{children}</h4>;
};

const NavigationContainer: React.FC<ContainerProps> = ({
  children,
  className,
}) => {
  return <h4 className={cn("px-24", className)}>{children}</h4>;
};

export { Container, NavigationContainer };
