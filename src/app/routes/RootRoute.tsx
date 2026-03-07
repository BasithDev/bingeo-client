import { createRootRoute, Outlet } from "@tanstack/react-router";
import { MaintenancePage } from "@/components/shared/MaintenancePage";
import { useAuthStore } from "@/stores/auth.store";

const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === "true";
let authInitPromise: Promise<void> | null = null;
function ensureAuthInit(): Promise<void> {
  if (!authInitPromise) {
    authInitPromise = useAuthStore.getState().initAuth();
  }
  return authInitPromise;
}

const RootComponent = () => {
  if (isMaintenanceMode) {
    return <MaintenancePage />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
    </div>
  );
};

const rootRoute = createRootRoute({
  component: RootComponent,
  beforeLoad: () => ensureAuthInit(),
});

export default rootRoute;
