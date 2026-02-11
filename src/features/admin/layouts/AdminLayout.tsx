import { Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { AdminSidebar } from "../components/AdminSidebar";
import { AdminHeader } from "../components/AdminHeader";
import { AdminMobileNav } from "../components/AdminMobileNav";
import { useAdminThemeStore } from "../stores/admin-theme.store";

/**
 * Shared admin layout — wraps all post-login admin pages.
 * Header + Sidebar (desktop) / BottomNav (mobile) + Content area.
 */
export function AdminLayout() {
  const { theme } = useAdminThemeStore();

  // Ensure theme attribute is set on mount
  useEffect(() => {
    document.documentElement.setAttribute("data-admin-theme", theme);
    return () => {
      document.documentElement.removeAttribute("data-admin-theme");
    };
  }, [theme]);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar — desktop only */}
      <AdminSidebar />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader />

        {/* Page content — extra bottom padding on mobile for bottom nav */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 lg:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <AdminMobileNav />
    </div>
  );
}
