import { createRoute, redirect } from "@tanstack/react-router";
import rootRoute from "../RootRoute";
import { AdminLoginPage } from "@/features/admin/pages/AdminLoginPage";
import { AdminDashboardPage } from "@/features/admin/pages/AdminDashboardPage";
import { AdminUsersPage } from "@/features/admin/pages/AdminUsersPage";
import { PlansOverviewPage } from "@/features/admin/pages/PlansOverviewPage";
import { PlansManagePage } from "@/features/admin/pages/PlansManagePage";
import { ContentUploadPage } from "@/features/admin/pages/ContentUploadPage";
import { ContentDraftsPage } from "@/features/admin/pages/ContentDraftsPage";
import { AnalyticsUsersPage } from "@/features/admin/pages/AnalyticsUsersPage";
import { AnalyticsRevenuePage } from "@/features/admin/pages/AnalyticsRevenuePage";
import { AnalyticsEngagementPage } from "@/features/admin/pages/AnalyticsEngagementPage";
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
  component: ContentUploadPage,
  validateSearch: (search: Record<string, unknown>) => ({
    draft: (search.draft as string) || undefined,
  }),
});

const adminContentDraftsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/content/drafts",
  component: ContentDraftsPage,
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
  beforeLoad: () => {
    throw redirect({ to: "/admin/analytics/users" });
  },
});

const adminAnalyticsUsersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/analytics/users",
  component: AnalyticsUsersPage,
});

const adminAnalyticsRevenueRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/analytics/revenue",
  component: AnalyticsRevenuePage,
});

const adminAnalyticsEngagementRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/analytics/engagement",
  component: AnalyticsEngagementPage,
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
    adminContentDraftsRoute,
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
