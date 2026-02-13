import { createRootRoute, Outlet } from "@tanstack/react-router";

const RootComponent = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
    </div>
  );
};

const rootRoute = createRootRoute({
  component: RootComponent,
});

export default rootRoute;
