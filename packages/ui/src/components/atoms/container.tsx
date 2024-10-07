import React, { type PropsWithChildren } from "react";

interface ContainerProps {}

export const Container: React.FC<ContainerProps> = ({
  children,
}: PropsWithChildren) => {
  return <div className="px-60">{children}</div>;
};
