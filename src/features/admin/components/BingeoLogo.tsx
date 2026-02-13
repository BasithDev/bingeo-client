/**
 * Bingeo brand logo component with animated violet glow.
 * Used across admin pages — login, sidebar, header.
 */
export function BingeoLogo({
  size = "default",
  className = "",
}: {
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  const sizeMap = {
    sm: "text-xl",
    default: "text-3xl",
    lg: "text-5xl",
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon mark */}
      <div className="relative">
        <div
          className={`
            flex items-center justify-center rounded-xl
            ${size === "sm" ? "w-8 h-8" : size === "lg" ? "w-14 h-14" : "w-10 h-10"}
          `}
          style={{
            background: "linear-gradient(135deg, #7C3AED, #5B21B6)",
            boxShadow: "0 0 30px oklch(0.65 0.25 280 / 30%)",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={`${size === "sm" ? "w-4 h-4" : size === "lg" ? "w-8 h-8" : "w-5 h-5"} text-white`}
          >
            <title>Bingeo Logo Mark</title>
            <path
              d="M4 8L12 4L20 8V16L12 20L4 16V8Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M9 11L11 13L15 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Glow ring */}
        <div
          className="absolute -inset-1 rounded-xl opacity-40 blur-md -z-10"
          style={{
            background: "linear-gradient(135deg, #7C3AED, #5B21B6)",
          }}
        />
      </div>

      {/* Wordmark */}
      <span
        className={`font-bold tracking-tight ${sizeMap[size]}`}
        style={{ fontFamily: "var(--font-heading)" }}
      >
        <span className="text-violet">Bingeo</span>
      </span>
    </div>
  );
}
