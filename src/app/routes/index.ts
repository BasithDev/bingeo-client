import { createRouter } from "@tanstack/react-router";
import { NotFoundPage } from "@/components/shared/NotFoundPage";
import { AdminRoutes } from "./admin/AdminRoutes";
import rootRoute from "./RootRoute";
import { UserRoutes } from "./user/UserRoutes";

const routeTree = rootRoute.addChildren([...UserRoutes, ...AdminRoutes]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultNotFoundComponent: NotFoundPage,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
