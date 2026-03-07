import { createRoute } from "@tanstack/react-router";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { VerifyOtpPage } from "@/features/auth/pages/VerifyOtpPage";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "@/features/auth/pages/ResetPasswordPage";
import { HomePage } from "@/features/content/pages/HomePage";
import { LandingPage } from "@/features/content/pages/LandingPage";
import { redirectToHomeIfAuth, redirectToLoginIfNotAuth } from "@/app/guards/auth.guards";
import rootRoute from "../RootRoute";

/** Public landing page — redirects to /home if already authenticated */
const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
  beforeLoad: redirectToHomeIfAuth,
});

/** Authenticated home dashboard */
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/home",
  component: HomePage,
  beforeLoad: redirectToLoginIfNotAuth,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
  beforeLoad: redirectToHomeIfAuth,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
  beforeLoad: redirectToHomeIfAuth,
});

/** OTP verification — public (user arrives here after register or unverified login) */
const verifyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/verify",
  component: VerifyOtpPage,
  validateSearch: (search: Record<string, unknown>) => ({
    userId: (search.userId as string) || "",
  }),
});

/** Forgot password — public */
const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forgot-password",
  component: ForgotPasswordPage,
  beforeLoad: redirectToHomeIfAuth,
});

/** Reset password — public (user arrives here after forgot-password with OTP) */
const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reset-password",
  component: ResetPasswordPage,
  validateSearch: (search: Record<string, unknown>) => ({
    userId: (search.userId as string) || "",
  }),
});

export const UserRoutes = [
  landingRoute,
  homeRoute,
  loginRoute,
  registerRoute,
  verifyRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
];
