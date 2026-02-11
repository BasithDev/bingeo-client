import { createRoute, redirect } from "@tanstack/react-router";
import rootRoute from "../RootRoute";
import { AdminLoginPage } from "@/features/admin/pages/AdminLoginPage";
import { AdminDashboardPage } from "@/features/admin/pages/AdminDashboardPage";
import { AdminUsersPage } from "@/features/admin/pages/AdminUsersPage";
import { PlansOverviewPage } from "@/features/admin/pages/PlansOverviewPage";
import { PlansManagePage } from "@/features/admin/pages/PlansManagePage";
import { AdminLayout } from "@/features/admin/layouts/AdminLayout";

// /admin → redirect to login
const adminIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  beforeLoad: () => {
    throw redirect({ to: "/admin/login" });
  },
});

// /admin/login — outside layout (no sidebar on login)
const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/login",
  component: AdminLoginPage,
});

// Admin layout wrapper — parent for all post-login admin pages
const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "admin-layout",
  component: AdminLayout,
});

// ── Dashboard ────────────────────────────────────
const adminDashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/dashboard",
  component: AdminDashboardPage,
});

// ── Plans ────────────────────────────────────────
const adminPlansRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/plans",
  component: PlansOverviewPage,
});

const adminPlansManageRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/plans/manage",
  component: PlansManagePage,
});

// ── Content ──────────────────────────────────────
const adminContentUploadRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/content/upload",
  component: () => <PlaceholderPage title="Upload Content" />,
});

const adminContentManageRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/content/manage",
  component: () => <PlaceholderPage title="Manage Content" />,
});

// ── Users ────────────────────────────────────────
const adminUsersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/users",
  component: AdminUsersPage,
});

// ── Analytics ────────────────────────────────────
const adminAnalyticsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/analytics",
  component: () => <PlaceholderPage title="Analytics Overview" />,
});

const adminAnalyticsUsersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/analytics/users",
  component: () => <PlaceholderPage title="User Analytics" />,
});

const adminAnalyticsRevenueRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/analytics/revenue",
  component: () => <PlaceholderPage title="Revenue" />,
});

const adminAnalyticsEngagementRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/analytics/engagement",
  component: () => <PlaceholderPage title="Engagement" />,
});

// ── Settings ─────────────────────────────────────
const adminSettingsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/settings",
  component: () => <PlaceholderPage title="General Settings" />,
});

const adminSettingsAppearanceRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/settings/appearance",
  component: () => <PlaceholderPage title="Appearance" />,
});

// Simple placeholder component for pages not yet built
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1
        className="text-2xl font-bold text-foreground mb-2"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {title}
      </h1>
      <p className="text-sm text-muted-foreground">
        This page is under construction.
      </p>
    </div>
  );
}

export const AdminRoutes = [
  adminIndexRoute,
  adminLoginRoute,
  adminLayoutRoute.addChildren([
    adminDashboardRoute,
    adminPlansRoute,
    adminPlansManageRoute,
    adminContentUploadRoute,
    adminContentManageRoute,
    adminUsersRoute,
    adminAnalyticsRoute,
    adminAnalyticsUsersRoute,
    adminAnalyticsRevenueRoute,
    adminAnalyticsEngagementRoute,
    adminSettingsRoute,
    adminSettingsAppearanceRoute,
  ]),
];
