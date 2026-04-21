import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface ITextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, ITextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-xl border border-border bg-background",
            "px-4 py-3 text-sm font-medium text-foreground",
            "placeholder:text-muted-foreground",
            "outline-none transition-all duration-200",
            "hover:border-border/80",
            "focus:border-primary/40 focus:ring-2 focus:ring-primary/20",
            "resize-none",
            error && "border-destructive/60 focus:border-destructive/80 focus:ring-destructive/20",
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

export { Textarea, type ITextareaProps };
