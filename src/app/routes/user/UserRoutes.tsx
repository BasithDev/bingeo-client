import { createRoute } from "@tanstack/react-router";
import { HomePage } from "@/features/content/pages/HomePage";
import rootRoute from "../RootRoute";

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

export const UserRoutes = [homeRoute];
