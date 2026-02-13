import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterDropdownProps {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  className?: string;
}

export function FilterDropdown({
  label,
  value,
  options,
  onChange,
  className,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-2 h-10 px-3 rounded-xl border border-border bg-card",
          "text-sm font-medium cursor-pointer",
          "hover:bg-muted transition-colors duration-150",
          value ? "text-foreground" : "text-muted-foreground",
        )}
      >
        <span className="text-muted-foreground text-xs font-medium">{label}:</span>
        <span>{selected?.label ?? "All"}</span>
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform duration-150", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          className={cn(
            "absolute top-full left-0 mt-1 z-50 min-w-[160px]",
            "rounded-xl border border-border bg-card shadow-lg py-1",
          )}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={cn(
                "flex items-center gap-2 w-full px-3 py-2 text-sm cursor-pointer",
                "hover:bg-muted transition-colors duration-100",
                opt.value === value ? "text-primary font-medium" : "text-foreground",
              )}
            >
              <Check
                className={cn(
                  "h-3.5 w-3.5 shrink-0",
                  opt.value === value ? "opacity-100" : "opacity-0",
                )}
              />
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
