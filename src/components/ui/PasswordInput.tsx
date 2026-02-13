import { Eye, EyeOff } from "lucide-react";
import { forwardRef, type InputHTMLAttributes, type ReactNode, useState } from "react";
import { cn } from "@/utils/cn";

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700">
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
            type={visible ? "text" : "password"}
            className={cn(
              "w-full rounded-xl border border-gray-200 bg-gray-50/60",
              "px-4 py-3 pr-11 text-sm font-medium text-gray-900",
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
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 transition-colors hover:text-gray-600"
            aria-label={visible ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {error && <p className="text-xs font-medium text-red-500">{error}</p>}
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput, type PasswordInputProps };
