import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth.store";

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


export async function redirectToAdminDashboardIfAuth() {
  await waitForAuthInit();

  const { isAuthenticated, user } = useAuthStore.getState();

  if (isAuthenticated && user?.role === "admin") {
    throw redirect({ to: "/admin/dashboard" });
  }
}

export async function redirectToAdminLoginIfNotAuth() {
  await waitForAuthInit();

  const { isAuthenticated, user } = useAuthStore.getState();

  if (!isAuthenticated || user?.role !== "admin") {
    throw redirect({ to: "/admin/login" });
  }
}


export async function redirectToHomeIfAuth() {
  await waitForAuthInit();

  const { isAuthenticated } = useAuthStore.getState();

  if (isAuthenticated) {
    throw redirect({ to: "/home" });
  }
}


export async function redirectToLoginIfNotAuth() {
  await waitForAuthInit();

  const { isAuthenticated } = useAuthStore.getState();

  if (!isAuthenticated) {
    throw redirect({ to: "/login" });
  }
}
