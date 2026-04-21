/**
 * Auth Guards for Route Protection
 *
 * These guards are async — they wait for initAuth() to complete
 * before checking auth state, preventing race conditions with
 * the initial session restore from cookies.
 */

import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth.store";

/**
 * Wait for auth initialization to finish.
 * Guards call this first so they don't check state while initAuth() is still in-flight.
 */
async function waitForAuthInit(): Promise<void> {
  const { isInitializing } = useAuthStore.getState();

  if (isInitializing) {
    await new Promise<void>((resolve) => {
      const unsubscribe = useAuthStore.subscribe((state) => {
        if (!state.isInitializing) {
          unsubscribe();
          resolve();
        }
      });
    });
  }
}

/**
 * Use on admin login route — if already authenticated as admin, redirect to dashboard.
 */
export async function redirectToAdminDashboardIfAuth() {
  await waitForAuthInit();

  const { isAuthenticated, user } = useAuthStore.getState();

  if (isAuthenticated && user?.role === "admin") {
    throw redirect({ to: "/admin/dashboard" });
  }
}

/**
 * Use on protected admin routes — if not authenticated as admin, redirect to login.
 */
export async function redirectToAdminLoginIfNotAuth() {
  await waitForAuthInit();

  const { isAuthenticated, user } = useAuthStore.getState();

  if (!isAuthenticated || user?.role !== "admin") {
    throw redirect({ to: "/admin/login" });
  }
}

/**
 * Use on user login/register routes — if already authenticated, redirect to home.
 */
export async function redirectToHomeIfAuth() {
  await waitForAuthInit();

  const { isAuthenticated } = useAuthStore.getState();

  if (isAuthenticated) {
    throw redirect({ to: "/home" });
  }
}

/**
 * Use on protected user routes — if not authenticated, redirect to login.
 */
export async function redirectToLoginIfNotAuth() {
  await waitForAuthInit();

  const { isAuthenticated } = useAuthStore.getState();

  if (!isAuthenticated) {
    throw redirect({ to: "/login" });
  }
}
