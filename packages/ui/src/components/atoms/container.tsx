import React, { type PropsWithChildren } from "react";

interface ContainerProps {}

const Container: React.FC<ContainerProps> = ({
  children,
}: PropsWithChildren) => {
  return <div className="px-60">{children}</div>;
};

export default Container;
