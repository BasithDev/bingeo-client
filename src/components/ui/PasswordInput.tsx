import { Eye, EyeOff } from "lucide-react";
import { forwardRef, type InputHTMLAttributes, type ReactNode, useState } from "react";
import { cn } from "@/utils/cn";

interface IPasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  variant?: "default" | "lightFixed";
}

const PasswordInput = forwardRef<HTMLInputElement, IPasswordInputProps>(
  ({ className, label, error, icon, id, variant = "default", ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const isLight = variant === "lightFixed";

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "block text-sm font-medium",
              isLight ? "text-gray-700" : "text-foreground",
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div
              className={cn(
                "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2",
                isLight ? "text-gray-400" : "text-muted-foreground",
              )}
            >
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            type={visible ? "text" : "password"}
            className={cn(
              "w-full rounded-xl border px-4 py-3 pr-11 text-sm font-medium",
              isLight
                ? "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
                : "border-border bg-background text-foreground placeholder:text-muted-foreground",
              "outline-none transition-all duration-200",
              isLight ? "hover:border-gray-300" : "hover:border-border/80",
              isLight
                ? "focus:border-violet/40 focus:bg-white focus:ring-2 focus:ring-violet/10"
                : "focus:border-primary/40 focus:ring-2 focus:ring-primary/20",
              icon && "pl-11",
              error &&
                (isLight
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                  : "border-destructive/60 focus:border-destructive/80 focus:ring-destructive/20"),
              className,
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className={cn(
              "absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer transition-colors",
              isLight ? "text-gray-400 hover:text-gray-600" : "text-muted-foreground hover:text-foreground",
            )}
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

export { PasswordInput, type IPasswordInputProps };
