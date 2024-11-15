import { forwardRef } from "react";

interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<IButton> = forwardRef<HTMLButtonElement, IButton>(
  ({ ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="submit"
        {...props}
        className={`cursor-pointer text-base  font-normal ${props.className}`}
      >
        {props.children}
      </button>
    );
  },
);

Button.displayName = "Button";
