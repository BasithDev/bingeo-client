import { useState, type ReactNode } from "react";
import {
  RefreshCw,
  AreaChart as AreaIcon,
  BarChart3 as BarIcon,
  LineChart as LineIcon,
} from "lucide-react";
import { cn } from "@/utils/cn";

/* ── Time range options ───────────────────────── */

const ranges = ["7D", "30D", "90D", "1Y"] as const;
export type TimeRange = (typeof ranges)[number];

/* ── Chart style options ──────────────────────── */

export type ChartStyle = "area" | "bar" | "line";

const styleIcons: Record<ChartStyle, typeof AreaIcon> = {
  area: AreaIcon,
  bar: BarIcon,
  line: LineIcon,
};

/* ── Props ────────────────────────────────────── */

export interface ChartCardProps {
  title: string;
  /** Optional subtitle / helper text */
  subtitle?: string;
  /**
   * If `chartStyles` is provided, `children` must be a render function
   * that receives the current chart style. Otherwise, children is normal JSX.
   */
  children: ReactNode | ((style: ChartStyle) => ReactNode);
  className?: string;
  /** If false, hides the time-range pills and refetch button. Default true. */
  controls?: boolean;
  /** Available chart styles for this card. Pass e.g. ["area", "bar", "line"]. */
  chartStyles?: ChartStyle[];
  /** Default chart style */
  defaultStyle?: ChartStyle;
  /** Called when the user picks a new range or clicks refetch. */
  onRangeChange?: (range: TimeRange) => void;
  onRefetch?: () => void;
  /** Default selected range */
  defaultRange?: TimeRange;
}

export function ChartCard({
  title,
  subtitle,
  children,
  className,
  controls = true,
  chartStyles,
  defaultStyle,
  onRangeChange,
  onRefetch,
  defaultRange = "30D",
}: ChartCardProps) {
  const [range, setRange] = useState<TimeRange>(defaultRange);
  const [spinning, setSpinning] = useState(false);
  const [style, setStyle] = useState<ChartStyle>(defaultStyle ?? chartStyles?.[0] ?? "area");

  const handleRange = (r: TimeRange) => {
    setRange(r);
    onRangeChange?.(r);
  };

  const handleRefetch = () => {
    setSpinning(true);
    onRefetch?.();
    setTimeout(() => setSpinning(false), 600);
  };

  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5", className)}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div>
            <h3
              className="text-sm font-semibold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {title}
            </h3>
            {subtitle && (
              <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        {controls && (
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Chart style switcher */}
            {chartStyles && chartStyles.length > 1 && (
              <div className="flex items-center gap-0.5 p-0.5 bg-muted rounded-lg">
                {chartStyles.map((s) => {
                  const Icon = styleIcons[s];
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStyle(s)}
                      title={`${s.charAt(0).toUpperCase() + s.slice(1)} chart`}
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-md cursor-pointer",
                        "transition-colors duration-150",
                        style === s
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Icon className="h-3 w-3" />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Time range pills */}
            <div className="flex items-center gap-0.5 p-0.5 bg-muted rounded-lg">
              {ranges.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRange(r)}
                  className={cn(
                    "px-2 py-1 rounded-md text-[10px] font-semibold cursor-pointer",
                    "transition-colors duration-150",
                    range === r
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Refetch */}
            <button
              type="button"
              onClick={handleRefetch}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg cursor-pointer",
                "border border-border text-muted-foreground hover:text-foreground hover:bg-muted",
                "transition-colors duration-150",
              )}
              title="Refetch data"
            >
              <RefreshCw
                className={cn("h-3 w-3", spinning && "animate-spin")}
              />
            </button>
          </div>
        )}
      </div>

      {/* Body — render function for chart style or plain children */}
      {typeof children === "function" ? children(style) : children}
    </div>
  );
}
