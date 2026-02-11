import { type InputHTMLAttributes, type ReactNode, forwardRef } from "react";
import { cn } from "@/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              "w-full rounded-xl border border-gray-200 bg-gray-50/60",
              "px-4 py-3 text-sm font-medium text-gray-900",
              "placeholder:text-gray-400",
              "outline-none transition-all duration-200",
              "hover:border-gray-300",
              "focus:border-violet/40 focus:bg-white focus:ring-2 focus:ring-violet/10",
              icon && "pl-11",
              error && "border-red-300 focus:border-red-400 focus:ring-red-100",
              className,
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs font-medium text-red-500">{error}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input, type InputProps };
