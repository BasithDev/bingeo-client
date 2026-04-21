import { Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface IColumn<T> {
  key: string;
  header: string;
  render: (row: T, index: number) => ReactNode;
  className?: string;
  minWidth?: string;
}

export interface IDataTableProps<T> {
  columns: IColumn<T>[];
  data: T[];
  loading?: boolean;
  skeletonRows?: number;
  emptyIcon?: ReactNode;
  emptyMessage?: string;
  emptyAction?: ReactNode;
  rowKey?: (row: T, index: number) => string | number;
  footer?: ReactNode;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  skeletonRows = 8,
  emptyIcon,
  emptyMessage = "No data found.",
  emptyAction,
  rowKey,
  footer,
  className,
}: IDataTableProps<T>) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
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

          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: skeletonRows }).map((_, i) => (
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
                    {emptyAction}
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
      {footer && <div className="border-t border-border px-4 py-2">{footer}</div>}
    </div>
  );
}
