import React, { memo } from "react";

interface ButtonProps {}

export const Button: React.FC<ButtonProps> = () => {
  return <button className="btn btn-neutral">Neutral</button>;
};
