import { cn } from "@repo/ui/utils";
import React, { type ReactNode } from "react";

interface ContainerProps {}

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return <div className={cn("px-60", className)}>{children}</div>;
};

const NavigationContainer: React.FC<ContainerProps> = ({
  children,
  className,
}) => {
  return <div className={cn("px-24", className)}>{children}</div>;
};

export { Container, NavigationContainer };
