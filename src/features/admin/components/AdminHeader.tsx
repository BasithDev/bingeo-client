import { useLocation, useNavigate } from "@tanstack/react-router";
import { ChevronDown, LogOut, Moon, Settings, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { cn } from "@/utils/cn";
import { useAdminThemeStore } from "../stores/admin-theme.store";

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  content: "Content",
  movies: "Movies",
  series: "Series",
  uploads: "Uploads",
  users: "Users",
  subscriptions: "Subscriptions",
  analytics: "Analytics",
  revenue: "Revenue",
  engagement: "Engagement",
  settings: "Settings",
  appearance: "Appearance",
  general: "General",
};

function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: string[] = [];
  for (const segment of segments) {
    if (segment === "admin") continue;
    crumbs.push(routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1));
  }
  return crumbs;
}

export function AdminHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const crumbs = generateBreadcrumbs(location.pathname);
  const { theme, toggleTheme } = useAdminThemeStore();
  const { user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-4 md:px-6">
      {/* Left: mobile logo + breadcrumbs */}
      <div className="flex items-center gap-3">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-primary">
              <title>Bingeo Logo</title>
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
          <span
            className="text-base font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Bingeo
          </span>
        </div>

        {/* Breadcrumbs (desktop) */}
        <nav className="hidden lg:flex items-center gap-1.5 text-sm">
          {crumbs.map((crumb, i) => (
            <span key={crumb} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-muted-foreground/40">/</span>}
              <span
                className={
                  i === crumbs.length - 1 ? "font-medium text-foreground" : "text-muted-foreground"
                }
              >
                {crumb}
              </span>
            </span>
          ))}
        </nav>
      </div>

      {/* Right: Admin profile dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen((v) => !v)}
          className={cn(
            "flex items-center gap-2.5 rounded-xl px-3 py-2 cursor-pointer",
            "transition-colors duration-150",
            "hover:bg-muted",
            dropdownOpen && "bg-muted",
          )}
        >
          {/* Avatar */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary text-sm font-semibold">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-foreground leading-tight">
              {user?.name || "Admin"}
            </p>
            <p className="text-[11px] text-muted-foreground leading-tight">
              {user?.email || "admin@bingeo.com"}
            </p>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              dropdownOpen && "rotate-180",
            )}
          />
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-card shadow-lg py-1.5 z-50">
            {/* User info */}
            <div className="px-4 py-2.5 border-b border-border">
              <p className="text-sm font-medium text-foreground">{user?.name || "Admin"}</p>
              <p className="text-xs text-muted-foreground">{user?.email || "admin@bingeo.com"}</p>
            </div>

            {/* Theme toggle */}
            <button
              type="button"
              onClick={() => {
                toggleTheme();
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-muted-foreground" />
              )}
              <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
            </button>

            {/* Settings */}
            <button
              type="button"
              onClick={() => {
                setDropdownOpen(false);
                navigate({ to: "/admin/settings" });
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span>Settings</span>
            </button>

            <div className="my-1 border-t border-border" />

            {/* Logout */}
            <button
              type="button"
              onClick={() => {
                logout();
                setDropdownOpen(false);
                window.location.href = "/admin/login";
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
