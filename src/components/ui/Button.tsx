import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/cn";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "font-semibold text-sm rounded-xl",
    "transition-all duration-200 ease-out",
    "cursor-pointer select-none",
    "disabled:opacity-50 disabled:pointer-events-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white",
          "hover:from-[#8B5CF6] hover:to-[#7C3AED]",
          "hover:shadow-[0_4px_20px_rgba(124,58,237,0.35)]",
          "active:shadow-[0_2px_8px_rgba(124,58,237,0.25)]",
          "focus-visible:ring-[#7C3AED]",
        ].join(" "),
        secondary: [
          "bg-gray-100 text-gray-900",
          "hover:bg-gray-200",
          "focus-visible:ring-gray-400",
        ].join(" "),
        ghost: [
          "bg-transparent text-gray-600",
          "hover:bg-gray-100 hover:text-gray-900",
          "focus-visible:ring-gray-400",
        ].join(" "),
        destructive: [
          "bg-red-500 text-white",
          "hover:bg-red-600",
          "focus-visible:ring-red-500",
        ].join(" "),
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-base",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  },
);

interface IButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, IButtonProps>(
  ({ className, variant, size, fullWidth, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants, type IButtonProps };
