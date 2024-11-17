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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        className={`cursor-pointer rounded-full bg-[#2849F5] px-6 py-4  text-base font-normal text-white ${props.className}`}
      >
        {props.children}
      </button>
    );
  },
);

Button.displayName = "Button";
