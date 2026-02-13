import { Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

/* ── Column definition ─────────────────────────── */

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T, index: number) => ReactNode;
  /** Optional className for the <th> and <td> */
  className?: string;
  /** Minimum width (CSS value) */
  minWidth?: string;
}

/* ── Props ─────────────────────────────────────── */

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  /** Number of skeleton rows to show when loading (default: 8) */
  skeletonRows?: number;
  emptyIcon?: ReactNode;
  emptyMessage?: string;
  /** Unique key extractor — falls back to index */
  rowKey?: (row: T, index: number) => string | number;
  /** Footer slot — typically Pagination */
  footer?: ReactNode;
  className?: string;
}

/* ── Component ─────────────────────────────────── */

export function DataTable<T>({
  columns,
  data,
  loading = false,
  skeletonRows = 8,
  emptyIcon,
  emptyMessage = "No data found.",
  rowKey,
  footer,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* ── Head ── */}
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                    col.className,
                  )}
                  style={col.minWidth ? { minWidth: col.minWidth } : undefined}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* ── Body ── */}
          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: skeletonRows }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: Order is fixed for skeletons
                <tr key={`skeleton-row-${i}`}>
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-4 py-3.5", col.className)}>
                      <div className="h-4 w-3/4 rounded-md bg-muted animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    {emptyIcon ?? (
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                        <Inbox className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={rowKey ? rowKey(row, i) : i}
                  className="hover:bg-muted/30 transition-colors duration-100"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-4 py-3.5", col.className)}>
                      {col.render(row, i)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Footer ── */}
      {footer && <div className="border-t border-border px-4 py-2">{footer}</div>}
    </div>
  );
}
