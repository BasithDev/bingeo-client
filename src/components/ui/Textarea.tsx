import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-xl border border-gray-200 bg-gray-50/60",
            "px-4 py-3 text-sm font-medium text-gray-900",
            "placeholder:text-gray-400",
            "outline-none transition-all duration-200",
            "hover:border-gray-300",
            "focus:border-violet/40 focus:bg-white focus:ring-2 focus:ring-violet/10",
            "resize-none",
            error && "border-red-300 focus:border-red-400 focus:ring-red-100",
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs font-medium text-red-500">{error}</p>}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea, type TextareaProps };
