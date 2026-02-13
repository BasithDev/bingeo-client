import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold leading-5 whitespace-nowrap",
  {
    variants: {
      variant: {
        success: "bg-emerald-500/10 text-emerald-600",
        warning: "bg-amber-500/10 text-amber-600",
        error: "bg-red-500/10 text-red-600",
        info: "bg-blue-500/10 text-blue-600",
        default: "bg-muted text-muted-foreground",
        premium: "bg-violet/10 text-violet",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface StatusBadgeProps extends VariantProps<typeof badgeVariants> {
  children: ReactNode;
  className?: string;
}

export function StatusBadge({ variant, children, className }: StatusBadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)}>{children}</span>;
}
