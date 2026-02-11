import { Outlet } from "@tanstack/react-router";

/**
 * Root layout wrapper for the entire application.
 * Contains the main structural elements like header, sidebar, footer.
 */
export function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header will go here */}
      <main className="flex-1">
        <Outlet />
      </main>
      {/* Footer will go here */}
    </div>
  );
}
