import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  className,
}: PaginationProps) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);

  /** Build a compact page list with ellipsis */
  const getPages = (): (number | "...")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages: (number | "...")[] = [1];

    if (currentPage > 3) pages.push("...");

    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1);

    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("...");

    pages.push(totalPages);
    return pages;
  };

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-3 pt-4", className)}>
      {/* Info */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span>
          Showing <span className="font-medium text-foreground">{start}</span>–
          <span className="font-medium text-foreground">{end}</span> of{" "}
          <span className="font-medium text-foreground">{total}</span>
        </span>

        {onPageSizeChange && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className={cn(
              "h-8 rounded-lg border border-border bg-card px-2 text-xs text-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer",
            )}
          >
            {pageSizeOptions.map((s) => (
              <option key={s} value={s}>
                {s} / page
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            "text-muted-foreground hover:text-foreground hover:bg-muted",
            "transition-colors duration-150 cursor-pointer",
            "disabled:opacity-40 disabled:pointer-events-none",
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {getPages().map((p, i) =>
          p === "..." ? (
            <span key={`e-${i}`} className="flex h-8 w-8 items-center justify-center text-xs text-muted-foreground">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium",
                "transition-colors duration-150 cursor-pointer",
                p === currentPage
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              {p}
            </button>
          ),
        )}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            "text-muted-foreground hover:text-foreground hover:bg-muted",
            "transition-colors duration-150 cursor-pointer",
            "disabled:opacity-40 disabled:pointer-events-none",
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
