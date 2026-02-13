import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { type RenderOptions, render } from "@testing-library/react";
import type React from "react";

/* ══════════════════════════════════════════════════
   Test Utils
   Provides a custom render with all necessary application providers.
   ══════════════════════════════════════════════════ */

// Create a fresh QueryClient for each test to ensure isolation
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
      },
    },
  });

function AllTheProviders({ children }: { children: React.ReactNode }) {
  const queryClient = createTestQueryClient();

  // For basic component tests that don't need routing logic,
  // we still provide a minimal router context if needed.
  // Specialized routing tests should use the router-specific helpers below.
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Helper to render with TanStack Router context
export function renderWithRouter(ui: React.ReactElement, { routePath = "/" } = {}) {
  const rootRoute = createRootRoute({
    component: () => ui,
  });

  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({
      initialEntries: [routePath],
    }),
  });

  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

export * from "@testing-library/react";
export { customRender as render };
