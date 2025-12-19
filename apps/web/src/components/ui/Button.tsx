import { SpinnerIcon } from "@/components/svg";
import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-emerald hover:bg-emerald-hover text-white-forced font-medium",
  secondary: "bg-charcoal hover:bg-smoke text-ivory",
  ghost: "bg-transparent hover:bg-charcoal/50 text-silver hover:text-ivory",
  outline: "bg-transparent border border-charcoal hover:border-smoke text-silver hover:text-ivory",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = "", variant = "primary", size = "md", isLoading, disabled, children, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center justify-center gap-2 rounded-lg font-medium cursor-pointer
          transition-all duration-200 ease-out
          focus:outline-none focus:ring-2 focus:ring-emerald/50 focus:ring-offset-2 focus:ring-offset-midnight
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {isLoading && <SpinnerIcon className="animate-spin h-4 w-4" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
