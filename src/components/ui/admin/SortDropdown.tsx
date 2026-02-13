import { ArrowDown, ArrowUp, ArrowUpDown, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

export interface SortOption {
  label: string;
  value: string;
}

export interface SortDropdownProps {
  options: SortOption[];
  value: string;
  direction: "asc" | "desc";
  onChange: (value: string) => void;
  onDirectionChange: (dir: "asc" | "desc") => void;
  className?: string;
}

export function SortDropdown({
  options,
  value,
  direction,
  onChange,
  onDirectionChange,
  className,
}: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value);
  const DirIcon = direction === "asc" ? ArrowUp : ArrowDown;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div className="flex items-center gap-0">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex items-center gap-2 h-10 px-3 rounded-l-xl border border-border bg-card",
            "text-sm font-medium cursor-pointer",
            "hover:bg-muted transition-colors duration-150",
            "text-foreground",
          )}
        >
          <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{selected?.label ?? "Sort"}</span>
        </button>
        <button
          type="button"
          onClick={() => onDirectionChange(direction === "asc" ? "desc" : "asc")}
          className={cn(
            "flex items-center justify-center h-10 w-10 rounded-r-xl border border-l-0 border-border bg-card",
            "cursor-pointer hover:bg-muted transition-colors duration-150",
          )}
          title={direction === "asc" ? "Ascending" : "Descending"}
        >
          <DirIcon className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>

      {open && (
        <div
          className={cn(
            "absolute top-full left-0 mt-1 z-50 min-w-[180px]",
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
