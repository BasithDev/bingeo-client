import { createRouter } from "@tanstack/react-router";
import rootRoute from "./RootRoute";
import { UserRoutes } from "./user/UserRoutes";
import { AdminRoutes } from "./admin/AdminRoutes";

const routeTree = rootRoute.addChildren([
  ...UserRoutes,
  ...AdminRoutes,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
