import { Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { AdminHeader } from "../components/AdminHeader";
import { AdminMobileNav } from "../components/AdminMobileNav";
import { AdminSidebar } from "../components/AdminSidebar";
import { useAdminThemeStore } from "../stores/admin-theme.store";

export function AdminLayout() {
  const { theme } = useAdminThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-admin-theme", theme);
    return () => {
      document.documentElement.removeAttribute("data-admin-theme");
    };
  }, [theme]);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 lg:pb-6">
          <Outlet />
        </main>
      </div>

      <AdminMobileNav />
    </div>
  );
}
