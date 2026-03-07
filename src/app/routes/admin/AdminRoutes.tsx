import { createRoute, redirect } from "@tanstack/react-router";
import { AdminLoader } from "@/features/admin/components/AdminLoader";
import { AdminLayout } from "@/features/admin/layouts/AdminLayout";
import { AdminDashboardPage } from "@/features/admin/pages/AdminDashboardPage";
import { AdminForgotPasswordPage } from "@/features/admin/pages/AdminForgotPasswordPage";
import { AdminLoginPage } from "@/features/admin/pages/AdminLoginPage";
import { AdminResetPasswordPage } from "@/features/admin/pages/AdminResetPasswordPage";
import { AdminUsersPage } from "@/features/admin/pages/AdminUsersPage";
import { AnalyticsEngagementPage } from "@/features/admin/pages/AnalyticsEngagementPage";
import { AnalyticsRevenuePage } from "@/features/admin/pages/AnalyticsRevenuePage";
import { AnalyticsUsersPage } from "@/features/admin/pages/AnalyticsUsersPage";
import { ContentDraftsPage } from "@/features/admin/pages/ContentDraftsPage";
import { ContentUploadPage } from "@/features/admin/pages/ContentUploadPage";
import { PlansManagePage } from "@/features/admin/pages/PlansManagePage";
import { PlansOverviewPage } from "@/features/admin/pages/PlansOverviewPage";
import {
  redirectToAdminDashboardIfAuth,
  redirectToAdminLoginIfNotAuth,
} from "@/app/guards/auth.guards";
import rootRoute from "../RootRoute";

// /admin → redirect to login
const adminIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  beforeLoad: () => {
    throw redirect({ to: "/admin/login" });
  },
});

// /admin/login — public, outside layout (no sidebar)
// If already logged in as admin, redirect to dashboard
const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/login",
  component: AdminLoginPage,
  beforeLoad: redirectToAdminDashboardIfAuth,
  pendingComponent: AdminLoader,
});

// /admin/forgot-password — public, outside layout
const adminForgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/forgot-password",
  component: AdminForgotPasswordPage,
  beforeLoad: redirectToAdminDashboardIfAuth,
  pendingComponent: AdminLoader,
});

// /admin/reset-password — public, outside layout
const adminResetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/reset-password",
  component: AdminResetPasswordPage,
  validateSearch: (search: Record<string, unknown>) => ({
    userId: (search.userId as string) || "",
  }),
  pendingComponent: AdminLoader,
});

// Admin layout wrapper — parent for all protected admin pages
const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "admin-layout",
  component: AdminLayout,
  beforeLoad: redirectToAdminLoginIfNotAuth,
  pendingComponent: AdminLoader,
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
      <p className="text-sm text-muted-foreground">This page is under construction.</p>
    </div>
  );
}

export const AdminRoutes = [
  adminIndexRoute,
  adminLoginRoute,
  adminForgotPasswordRoute,
  adminResetPasswordRoute,
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
