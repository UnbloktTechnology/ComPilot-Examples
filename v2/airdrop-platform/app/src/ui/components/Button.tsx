import { forwardRef } from "react";

export type ButtonVariant = "primary" | "secondary" | "transparent" | "black";
interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  variant: ButtonVariant;
}

export const Button: React.FC<IButton> = forwardRef<HTMLButtonElement, IButton>(
  (
    { isLoading, children, className, variant = "secondary", ...props },
    ref,
  ) => {
    let variantClasses = "";
    let hoverClasses = "";

    if (variant === "primary") {
      variantClasses = "px-4 py-2 bg-[#6666FE] text-white";
      hoverClasses = "hover:bg-[#6666FE]/85"; // Primary button hover styles
    } else if (variant === "secondary") {
      variantClasses = "px-4 py-2 bg-white text-black";
      hoverClasses = "hover:bg-gray-100"; // Secondary button hover styles
    } else if (variant === "transparent") {
      variantClasses = "px-4 py-2 bg-transparent text-white";
      hoverClasses = "hover:bg-gray-100 hover:text-black"; // Transparent button hover styles
    } else if (variant === "black") {
      variantClasses = "px-8 py-1 bg-stone-950 text-white";
      hoverClasses = "hover:bg-stone-800"; // Black button
    }

    return (
      <button
        ref={ref}
        type="submit"
        {...props}
        className={`cursor-pointer rounded-full font-medium shadow ${variantClasses} ${className} ${
          (props.disabled ?? isLoading)
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer"
        } ${(props.disabled ?? isLoading) ? "" : hoverClasses}`}
        disabled={props.disabled ?? isLoading}
      >
        {isLoading ? "Loading..." : children}
      </button>
    );
  },
);

Button.displayName = "Button";
