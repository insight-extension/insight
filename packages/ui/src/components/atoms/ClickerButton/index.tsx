import React from "react";

interface ClickerButtonProps {
  onClick: () => Promise<void>;
  isGameReady: boolean;
  text: string;
}

export const ClickerButton: React.FC<ClickerButtonProps> = ({
  onClick,
  isGameReady,
  text,
}) => {
  return (
    <button
      disabled={!isGameReady}
      onClick={onClick}
      className="btn btn-lg bg-primary hover:bg-primary-focus text-primary-content border-primary-focus border-4 h-36 w-36 rounded-full"
    >
      {text}
    </button>
  );
};

//todo
//add memo
