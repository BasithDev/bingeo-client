import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { cn } from "@/utils/cn";
import { adminNavConfig, type NavItem } from "../config/adminNavConfig";

/**
 * Bottom navigation bar for mobile (< lg).
 * Shows top-level nav items. Items with submenus open an animated popover above the bar.
 */
export function AdminMobileNav() {
  const location = useLocation();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const getIsActive = (item: NavItem) =>
    item.path
      ? location.pathname === item.path
      : (item.children?.some((c) => location.pathname.startsWith(c.path)) ?? false);

  return (
    <>
      {/* Backdrop — fades in */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-40 transition-all duration-300",
          expandedItem
            ? "bg-black/20 backdrop-blur-[2px] pointer-events-auto"
            : "bg-transparent backdrop-blur-0 pointer-events-none",
        )}
        onClick={() => setExpandedItem(null)}
      />

      {/* Submenu panel — slides up from bottom */}
      <div
        className={cn(
          "lg:hidden fixed left-2 right-2 z-50 rounded-2xl border border-border bg-card shadow-xl p-2",
          "transition-all duration-300 ease-out",
          expandedItem
            ? "bottom-[72px] opacity-100 translate-y-0"
            : "bottom-[72px] opacity-0 translate-y-4 pointer-events-none",
        )}
      >
        {expandedItem &&
          adminNavConfig
            .find((i) => i.title === expandedItem)
            ?.children?.map((child) => {
              const childActive = location.pathname === child.path;
              return (
                <Link
                  key={child.path}
                  to={child.path}
                  onClick={() => setExpandedItem(null)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    childActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted",
                  )}
                >
                  <child.icon className="h-4 w-4 shrink-0" />
                  <span>{child.title}</span>
                </Link>
              );
            })}
      </div>

      {/* Bottom nav bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-md safe-area-bottom">
        <div className="flex overflow-x-auto scrollbar-hide px-1 py-1.5">
          {adminNavConfig.map((item) => {
            const isActive = getIsActive(item);
            const hasChildren = !!item.children?.length;
            const isExpanded = expandedItem === item.title;

            if (hasChildren) {
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setExpandedItem(isExpanded ? null : item.title)}
                  className={cn(
                    "flex flex-col items-center gap-0.5 min-w-[64px] flex-1 px-2 py-2 rounded-xl",
                    "text-[11px] font-medium transition-all duration-150 cursor-pointer",
                    isActive || isExpanded ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="truncate">{item.title}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.title}
                to={item.path || "/admin/dashboard"}
                className={cn(
                  "flex flex-col items-center gap-0.5 min-w-[64px] flex-1 px-2 py-2 rounded-xl",
                  "text-[11px] font-medium transition-all duration-150",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="truncate">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
