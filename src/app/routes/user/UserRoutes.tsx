import { createRoute } from "@tanstack/react-router";
import rootRoute from "../RootRoute";
import { HomePage } from "@/features/content/pages/HomePage";

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

export const UserRoutes = [homeRoute];
