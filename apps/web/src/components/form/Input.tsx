import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, hint, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-silver mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3 rounded-lg
            bg-charcoal/50 border border-charcoal
            text-ivory placeholder:text-ash
            transition-all duration-200
            focus:outline-none focus:border-emerald/50 focus:ring-2 focus:ring-emerald/20
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-400">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-2 text-sm text-ash">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

