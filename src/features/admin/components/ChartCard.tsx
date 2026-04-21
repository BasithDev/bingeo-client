import {
  AreaChart as AreaIcon,
  BarChart3 as BarIcon,
  LineChart as LineIcon,
  RefreshCw,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { cn } from "@/utils/cn";


const ranges = ["7D", "30D", "90D", "1Y"] as const;
export type TimeRange = (typeof ranges)[number];


export type ChartStyle = "area" | "bar" | "line";

const styleIcons: Record<ChartStyle, typeof AreaIcon> = {
  area: AreaIcon,
  bar: BarIcon,
  line: LineIcon,
};

export interface IChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode | ((style: ChartStyle) => ReactNode);
  className?: string;
  controls?: boolean;
  chartStyles?: ChartStyle[];
  defaultStyle?: ChartStyle;
  onRangeChange?: (range: TimeRange) => void;
  onRefetch?: () => void;
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
}: IChartCardProps) {
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
  
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div>
            <h3
              className="text-sm font-semibold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {title}
            </h3>
            {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
        </div>

        {controls && (
          <div className="flex items-center gap-1.5 shrink-0">
        
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
              <RefreshCw className={cn("h-3 w-3", spinning && "animate-spin")} />
            </button>
          </div>
        )}
      </div>

  
      {typeof children === "function" ? children(style) : children}
    </div>
  );
}
