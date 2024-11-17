import React, { useState } from "react";
import { Button } from "./Button";

interface IDisclaimerOverlay {
  content: string;
  textButton: string;
  className?: string;
  classNameButton?: string;
  onClick?: () => void;
}

export const DisclaimerOverlay = ({
  content,
  textButton,
  className = "",
  classNameButton = "",
  onClick,
}: IDisclaimerOverlay) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {isOpen && (
        <div
          className={`fixed bottom-0 left-0 right-0 z-[999999] flex justify-between bg-gray-900 p-4 text-white ${className}`}
        >
          <p className="w-10/12 text-base">{content}</p>
          <Button
            className={classNameButton}
            onClick={() => (onClick ? onClick() : setIsOpen(false))}
          >
            {textButton}
          </Button>
        </div>
      )}
    </>
  );
};
