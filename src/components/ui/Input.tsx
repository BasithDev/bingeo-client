import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/utils/cn";

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  variant?: "default" | "lightFixed";
}

const Input = forwardRef<HTMLInputElement, IInputProps>(
  ({ className, label, error, icon, id, variant = "default", ...props }, ref) => {
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
            className={cn(
              "w-full rounded-xl border px-4 py-3 text-sm font-medium",
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
        </div>
        {error && <p className="text-xs font-medium text-red-500">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input, type IInputProps };
